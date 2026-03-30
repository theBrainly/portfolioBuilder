import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { AppError, handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { resumeParsedDataSchema } from "@/lib/resumeImport";
import { getSessionUser } from "@/lib/session";
import { generateSlug } from "@/lib/utils";
import Experience from "@/models/Experience";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import { getEffectiveSubscriptionForUser, getRemainingPlanSlots } from "@/lib/subscription";

const resumeImportSchema = z.object({
  parsed: resumeParsedDataSchema,
  options: z
    .object({
      importSkills: z.boolean().default(true),
      importExperience: z.boolean().default(true),
      importProjects: z.boolean().default(true),
    })
    .default({
      importSkills: true,
      importExperience: true,
      importProjects: true,
    }),
});

function buildExperienceKey({
  company,
  position,
  startDate,
}: {
  company: string;
  position: string;
  startDate: string | Date;
}) {
  const normalizedStartDate =
    startDate instanceof Date
      ? startDate.toISOString().slice(0, 10)
      : String(startDate).slice(0, 10);

  return `${company.trim().toLowerCase()}::${position.trim().toLowerCase()}::${normalizedStartDate}`;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = resumeImportSchema.parse(body);

    const hasAnythingToImport =
      (validated.options.importSkills && validated.parsed.skills.length > 0) ||
      (validated.options.importExperience && validated.parsed.experiences.length > 0) ||
      (validated.options.importProjects && validated.parsed.projects.length > 0);

    if (!hasAnythingToImport) {
      throw new AppError(
        "There was no parsed resume content ready to import.",
        400,
        "VALIDATION_ERROR"
      );
    }

    await connectDB();

    const [subscription, existingSkills, existingExperiences, existingProjects] = await Promise.all([
      getEffectiveSubscriptionForUser(user.id, { ensureRecord: true }),
      validated.options.importSkills ? Skill.find({ userId: user.id }).lean() : Promise.resolve([]),
      validated.options.importExperience
        ? Experience.find({ userId: user.id }).lean()
        : Promise.resolve([]),
      validated.options.importProjects
        ? Project.find({ userId: user.id }).lean()
        : Promise.resolve([]),
    ]);

    const existingSkillNames = new Set(
      existingSkills.map((skill: any) => skill.name.trim().toLowerCase())
    );
    const existingExperienceKeys = new Set(
      existingExperiences.map((experience: any) =>
        buildExperienceKey(
          experience as { company: string; position: string; startDate: string | Date }
        )
      )
    );
    const existingProjectTitles = new Set(
      existingProjects.map((project: any) => project.title.trim().toLowerCase())
    );
    const existingSlugs = new Set(existingProjects.map((project: any) => project.slug));

    const skillsToCreate = validated.options.importSkills
      ? validated.parsed.skills
          .filter((skill) => !existingSkillNames.has(skill.name.trim().toLowerCase()))
          .map((skill, index) => ({
            ...skill,
            userId: user.id,
            order: existingSkills.length + index,
          }))
      : [];

    const experiencesToCreate = validated.options.importExperience
      ? validated.parsed.experiences
          .filter(
            (experience) =>
              !existingExperienceKeys.has(
                buildExperienceKey({
                  company: experience.company,
                  position: experience.position,
                  startDate: experience.startDate,
                })
              )
          )
          .map((experience, index) => ({
            ...experience,
            userId: user.id,
            endDate: experience.isCurrent ? null : experience.endDate || null,
            order: existingExperiences.length + index,
          }))
      : [];

    const projectsToCreate = validated.options.importProjects
      ? validated.parsed.projects
          .filter((project) => !existingProjectTitles.has(project.title.trim().toLowerCase()))
          .map((project, index) => {
            let slug = generateSlug(project.title);
            while (existingSlugs.has(slug)) {
              slug = `${slug}-${Date.now()}-${index}`;
            }
            existingSlugs.add(slug);

            return {
              ...project,
              userId: user.id,
              slug,
              completionDate: project.completionDate || null,
              order: existingProjects.length + index,
            };
          })
      : [];

    const remainingSkillSlots = getRemainingPlanSlots(
      subscription.plan,
      "maxSkills",
      existingSkills.length
    );
    const remainingExperienceSlots = getRemainingPlanSlots(
      subscription.plan,
      "maxExperience",
      existingExperiences.length
    );
    const remainingProjectSlots = getRemainingPlanSlots(
      subscription.plan,
      "maxProjects",
      existingProjects.length
    );

    const cappedSkillsToCreate = Number.isFinite(remainingSkillSlots)
      ? skillsToCreate.slice(0, remainingSkillSlots)
      : skillsToCreate;
    const cappedExperiencesToCreate = Number.isFinite(remainingExperienceSlots)
      ? experiencesToCreate.slice(0, remainingExperienceSlots)
      : experiencesToCreate;
    const cappedProjectsToCreate = Number.isFinite(remainingProjectSlots)
      ? projectsToCreate.slice(0, remainingProjectSlots)
      : projectsToCreate;

    const hasImportableItemsBeforeLimits =
      skillsToCreate.length > 0 || experiencesToCreate.length > 0 || projectsToCreate.length > 0;
    const hasImportCapacity =
      cappedSkillsToCreate.length > 0 ||
      cappedExperiencesToCreate.length > 0 ||
      cappedProjectsToCreate.length > 0;

    if (hasImportableItemsBeforeLimits && !hasImportCapacity) {
      throw new AppError(
        "Your current plan limits are full. Upgrade to import more resume content.",
        403,
        "FORBIDDEN"
      );
    }

    const [createdSkills, createdExperiences, createdProjects] = await Promise.all([
      cappedSkillsToCreate.length ? Skill.insertMany(cappedSkillsToCreate, { ordered: false }) : [],
      cappedExperiencesToCreate.length
        ? Experience.insertMany(cappedExperiencesToCreate, { ordered: false })
        : [],
      cappedProjectsToCreate.length
        ? Project.insertMany(cappedProjectsToCreate, { ordered: false })
        : [],
    ]);

    return NextResponse.json({
      success: true,
      data: {
        created: {
          skills: createdSkills.length,
          experience: createdExperiences.length,
          projects: createdProjects.length,
        },
        skipped: {
          skills: validated.parsed.skills.length - cappedSkillsToCreate.length,
          experience: validated.parsed.experiences.length - cappedExperiencesToCreate.length,
          projects: validated.parsed.projects.length - cappedProjectsToCreate.length,
        },
      },
      message: "Resume data imported into your portfolio content.",
    });
  } catch (error) {
    return handleApiError(error, "POST /api/admin/resume/import");
  }
}

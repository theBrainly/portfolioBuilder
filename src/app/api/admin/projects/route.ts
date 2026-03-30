import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { escapeRegExp, generateSlug } from "@/lib/utils";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { assertPlanLimit, getEffectiveSubscriptionForUser } from "@/lib/subscription";

const PROJECT_CATEGORIES = new Set(["Full Stack", "Frontend", "Backend", "Mobile", "Other"]);

function parsePositiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number.parseInt(value || "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";
    const page = parsePositiveInteger(searchParams.get("page"), 1, 10000);
    const limit = parsePositiveInteger(searchParams.get("limit"), 20, 100);

    const filter: any = { userId: user.id };
    if (category && category !== "All" && PROJECT_CATEGORIES.has(category)) {
      filter.category = category;
    }

    if (search) {
      const escapedSearch = escapeRegExp(search.slice(0, 100));
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { shortDescription: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/projects");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = projectSchema.parse(body);

    await connectDB();
    const [subscription, totalProjects] = await Promise.all([
      getEffectiveSubscriptionForUser(user.id, { ensureRecord: true }),
      Project.countDocuments({ userId: user.id }),
    ]);

    assertPlanLimit(subscription.plan, "maxProjects", totalProjects, "projects");

    // Generate unique slug
    let slug = generateSlug(validated.title);
    const existingSlug = await Project.findOne({ userId: user.id, slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const project = await Project.create({ ...validated, userId: user.id, slug });

    return NextResponse.json(
      { success: true, data: project, message: "Project created!" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "POST /api/admin/projects");
  }
}

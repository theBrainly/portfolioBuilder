"use client";

import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import type { DesignPreset } from "@/constants/siteCustomization";
import type { IProject, ISiteSettings } from "@/types";

export default function ProjectsSection({
  projects,
  preset = "classic",
  settings = null,
}: {
  projects: IProject[];
  preset?: DesignPreset;
  settings?: ISiteSettings | null;
}) {
  const categories = Array.from(new Set(projects.map((project) => project.category))).slice(0, 3);
  const categorySummary = categories.length
    ? categories.join(", ").replace(/,([^,]*)$/, " and$1")
    : "product, frontend, and full-stack";

  if (preset === "minimal") {
    return (
      <section id="projects" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Projects"
            title="Selected work"
            description={`A clean, straightforward view of shipped work across ${categorySummary} projects.`}
            preset={preset}
            align="center"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 6).map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                preset={preset}
                settings={settings}
              />
            ))}
          </div>

          {projects.length === 0 && (
            <p className="py-16 text-center text-lg text-muted-foreground">
              Selected projects will appear here as they are published.
            </p>
          )}
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="projects" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Projects"
            title="Shipped builds"
            description={`A command-line inspired list of portfolio work across ${categorySummary} projects.`}
            preset={preset}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 6).map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                preset={preset}
                settings={settings}
              />
            ))}
          </div>

          {projects.length === 0 && (
            <p className="py-16 text-center font-mono text-lg text-primary/70">
              No project modules published yet.
            </p>
          )}
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="projects" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Projects"
            title="Project windows"
            description={`A desktop-style collection of work across ${categorySummary} categories, with each project opened like its own app.`}
            preset={preset}
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 6).map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                preset={preset}
                settings={settings}
              />
            ))}
          </div>

          {projects.length === 0 && (
            <p className="py-16 text-center text-lg text-white/70">
              Project windows will appear here as soon as they are published.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="Projects"
          title={`Selected work with clear\nproduct thinking`}
          description={`A closer look at shipped work across ${categorySummary} projects, showing how strategy, interface quality, and engineering come together.`}
          preset={preset}
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {projects.slice(0, 6).map((project, index) => (
            <div
              key={project._id}
              className={`${
                index === 0
                  ? "col-span-2 row-span-1 md:col-span-2"
                  : index === 3
                    ? "col-span-2 md:col-span-1"
                    : index === 4
                      ? "col-span-1 md:col-span-2"
                      : "col-span-1"
              }`}
            >
              <ProjectCard
                project={project}
                index={index}
                preset={preset}
                settings={settings}
              />
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="py-16 text-center text-lg text-muted-foreground">
            Selected projects will appear here as they are published.
          </p>
        )}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronRight, ExternalLink, Github, User } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PortfolioShell from "@/components/public/PortfolioShell";
import ProjectGallery from "@/components/public/ProjectGallery";
import Badge from "@/components/ui/Badge";
import { getPortfolioProjectPath, getPortfolioSectionHref } from "@/lib/portfolioUrl";
import { formatFullDate } from "@/lib/utils";
import type { IProject, ISiteSettings } from "@/types";

export default function PortfolioProjectContent({
  project,
  related,
  settings,
}: {
  project: IProject;
  related: IProject[];
  settings: ISiteSettings | null;
}) {
  const projectsHref = getPortfolioSectionHref("projects", settings);

  return (
    <PortfolioShell settings={settings}>
      <Navbar settings={settings} />
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="mb-8 flex items-center gap-2 text-sm text-text-muted">
            <Link
              href={projectsHref}
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Projects
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{project.title}</span>
          </div>

          {project.thumbnail && (
            <div className="premium-panel mb-10 h-64 w-full rounded-[32px] p-3 sm:h-80 md:h-[450px]">
              <div className="relative h-full w-full overflow-hidden rounded-[28px]">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-text-primary">
                  {project.title}
                </h1>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {project.longDescription && (
                <div className="premium-panel rounded-[30px] p-6 md:p-8">
                  <h2 className="text-xl font-semibold mb-4 text-text-primary">
                    About This Project
                  </h2>
                  <div className="text-text-secondary leading-relaxed space-y-4">
                    {project.longDescription
                      .split("\n")
                      .filter(Boolean)
                      .map((paragraph: string, index: number) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              )}

              {project.images?.length > 0 && (
                <div className="premium-panel rounded-[30px] p-6 md:p-8">
                  <h2 className="text-xl font-semibold mb-4 text-text-primary">Gallery</h2>
                  <ProjectGallery images={project.images} />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-button flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-button-secondary flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
                  >
                    <Github className="w-4 h-4" />
                    Source
                  </a>
                )}
              </div>

              <div className="premium-panel rounded-[28px] p-6 space-y-5">
                <h3 className="font-semibold text-lg text-text-primary">Project Details</h3>

                {project.clientName && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Client</p>
                      <p className="text-sm font-medium text-text-primary">{project.clientName}</p>
                    </div>
                  </div>
                )}

                {project.completionDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Completed</p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatFullDate(project.completionDate)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-text-muted mb-1">Category</p>
                  <Badge variant="primary">{project.category}</Badge>
                </div>
              </div>

              <div className="premium-panel rounded-[28px] p-6">
                <h3 className="font-semibold text-lg mb-4 text-text-primary">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-surface-2 text-text-secondary text-sm font-mono rounded-lg border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8 text-text-primary">More Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    href={getPortfolioProjectPath(item.slug, settings)}
                    className="premium-panel group rounded-[26px] overflow-hidden transition-all hover:-translate-y-1"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                          <span className="text-3xl">🚀</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 line-clamp-1">
                        {item.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </PortfolioShell>
  );
}

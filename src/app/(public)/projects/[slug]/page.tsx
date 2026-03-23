import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, User, ChevronRight } from "lucide-react";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Settings from "@/models/Settings";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Badge from "@/components/ui/Badge";
import ProjectGallery from "./ProjectGallery";
import { formatFullDate } from "@/lib/utils";
import type { Metadata } from "next";

async function getProject(slug: string) {
  await connectDB();
  const p = await Project.findOne({ slug, isVisible: true }).lean();
  return p ? JSON.parse(JSON.stringify(p)) : null;
}

async function getRelated(category: string, slug: string) {
  await connectDB();
  const p = await Project.find({ isVisible: true, category, slug: { $ne: slug } }).limit(3).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(p));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProject(params.slug);
  if (!p) return { title: "Not Found" };
  return { title: p.title, description: p.shortDescription, openGraph: { title: p.title, description: p.shortDescription, images: p.thumbnail ? [p.thumbnail] : [] } };
}

export const revalidate = 60;

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();
  const related = await getRelated(project.category, project.slug);
  await connectDB();
  const settings = await Settings.findOne().lean();
  const s = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <>
      <Navbar settings={s} />
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/#projects" className="hover:text-primary transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Projects</Link>
            <ChevronRight className="w-3 h-3" /><span className="text-text-primary">{project.title}</span>
          </div>
          {project.thumbnail && (
            <div className="relative w-full h-64 sm:h-80 md:h-[450px] rounded-3xl overflow-hidden border border-border mb-10">
              <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
            </div>
          )}
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div><h1 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">{project.title}</h1>
                <p className="text-text-secondary text-lg leading-relaxed">{project.shortDescription}</p></div>
              {project.longDescription && (
                <div><h2 className="text-xl font-semibold mb-4 text-text-primary">About This Project</h2>
                  <div className="text-text-secondary leading-relaxed space-y-4">{project.longDescription.split("\n").filter(Boolean).map((p: string, i: number) => <p key={i}>{p}</p>)}</div></div>
              )}
              {project.images?.length > 0 && <div><h2 className="text-xl font-semibold mb-4 text-text-primary">Gallery</h2><ProjectGallery images={project.images} /></div>}
            </div>
            <div className="space-y-6">
              <div className="flex gap-3">
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/25">
                  <ExternalLink className="w-4 h-4" />Live Demo</a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-border text-text-primary font-medium rounded-xl hover:border-primary hover:text-primary transition-all">
                  <Github className="w-4 h-4" />Source</a>}
              </div>
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-lg text-text-primary">Project Details</h3>
                {project.clientName && <div className="flex items-center gap-3"><User className="w-4 h-4 text-text-muted" /><div><p className="text-xs text-text-muted">Client</p><p className="text-sm font-medium text-text-primary">{project.clientName}</p></div></div>}
                {project.completionDate && <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-text-muted" /><div><p className="text-xs text-text-muted">Completed</p><p className="text-sm font-medium text-text-primary">{formatFullDate(project.completionDate)}</p></div></div>}
                <div><p className="text-xs text-text-muted mb-1">Category</p><Badge variant="primary">{project.category}</Badge></div>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-text-primary">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">{project.techStack.map((t: string) => <span key={t} className="px-3 py-1.5 bg-surface-2 text-text-secondary text-sm font-mono rounded-lg border border-border">{t}</span>)}</div>
              </div>
            </div>
          </div>
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8 text-text-primary">More Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r: any) => (
                  <Link key={r._id} href={`/projects/${r.slug}`} className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
                    <div className="relative h-40 overflow-hidden">
                      {r.thumbnail ? <Image src={r.thumbnail} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-surface-2 flex items-center justify-center"><span className="text-3xl">🚀</span></div>}
                    </div>
                    <div className="p-4"><h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{r.title}</h3>
                      <p className="text-sm text-text-muted mt-1 line-clamp-1">{r.shortDescription}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer settings={s} />
    </>
  );
}

"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { IProject } from "@/types";

export default function ProjectCard({ project, index }: { project: IProject; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }} className="group">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <Link href={`/projects/${project.slug}`}>
          <div className="relative h-48 sm:h-56 overflow-hidden">
            {project.thumbnail ? <Image src={project.thumbnail} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><span className="text-4xl">🚀</span></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors shadow-lg"><ExternalLink className="w-4 h-4" /></a>}
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-2 bg-surface-2 text-text-primary rounded-lg hover:bg-surface transition-colors shadow-lg border border-border"><Github className="w-4 h-4" /></a>}
            </div>
            {project.isFeatured && <div className="absolute top-3 left-3"><Badge variant="primary">⭐ Featured</Badge></div>}
          </div>
        </Link>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/projects/${project.slug}`}><h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3></Link>
            <Link href={`/projects/${project.slug}`} className="p-1 text-text-muted hover:text-primary transition-colors flex-shrink-0"><ArrowUpRight className="w-4 h-4" /></Link>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">{project.shortDescription}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => <span key={tech} className="px-2.5 py-1 bg-surface-2 text-text-secondary text-xs font-mono rounded-md">{tech}</span>)}
            {project.techStack.length > 4 && <span className="px-2.5 py-1 bg-surface-2 text-text-muted text-xs font-mono rounded-md">+{project.techStack.length - 4}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

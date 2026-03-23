"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import type { IProject } from "@/types";

const CATS = ["All", "Full Stack", "Frontend", "Backend", "Mobile"];

export default function ProjectsSection({ projects }: { projects: IProject[] }) {
  const [cat, setCat] = useState("All");
  const filtered = useMemo(() => cat === "All" ? projects : projects.filter((p) => p.category === cat), [projects, cat]);
  const available = CATS.filter((c) => c === "All" || projects.some((p) => p.category === c));

  return (
    <section id="projects" className="section-padding">
      <div className="section-container">
        <SectionHeader label="// projects" title="What I've Built" description="Here are some of my recent projects showcasing my skills and experience" />
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {available.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="relative px-5 py-2.5 text-sm font-medium rounded-xl transition-colors">
              {cat === c && <motion.div layoutId="projectFilter" className="absolute inset-0 bg-primary rounded-xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              <span className={`relative z-10 ${cat === c ? "text-white" : "text-text-secondary hover:text-text-primary"}`}>{c}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
          </motion.div>
        </AnimatePresence>
        {filtered.length === 0 && <p className="text-center py-16 text-text-muted text-lg">No projects in this category yet.</p>}
      </div>
    </section>
  );
}

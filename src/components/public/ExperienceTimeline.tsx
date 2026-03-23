"use client";
import { motion } from "framer-motion";
import { Calendar, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import MotionWrapper from "@/components/animations/MotionWrapper";
import SectionHeader from "./SectionHeader";
import { formatDate } from "@/lib/utils";
import type { IExperience } from "@/types";

export default function ExperienceTimeline({ experiences }: { experiences: IExperience[] }) {
  if (!experiences.length) return null;
  return (
    <section id="experience" className="section-padding">
      <div className="section-container">
        <SectionHeader label="// experience" title="Where I've Worked" description="My professional journey and contributions" />
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
          {experiences.map((exp, i) => (
            <MotionWrapper key={exp._id} delay={i * 0.15} className={`relative mb-12 last:mb-0 ${i % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:pl-[50%]"} pl-8 md:pl-0`}>
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 + 0.2, type: "spring" }}
                className={`absolute top-2 w-4 h-4 rounded-full border-4 border-background z-10 left-0 md:left-1/2 -translate-x-1/2 ${exp.isCurrent ? "bg-primary shadow-lg shadow-primary/30" : "bg-border"}`} />
              <div className={`bg-surface border border-border rounded-2xl p-6 hover:border-primary/20 hover:shadow-lg transition-all ${i % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
                <div className={`flex items-center gap-2 text-sm text-text-muted mb-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? formatDate(exp.endDate) : "N/A"}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-1">{exp.position}</h3>
                <div className={`flex items-center gap-2 mb-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                  <span className="text-primary font-medium">{exp.company}</span>
                  {exp.companyUrl && <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>}
                </div>
                <div className={`flex gap-2 mb-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                  <Badge variant="primary">{exp.type}</Badge>
                  {exp.isCurrent && <Badge variant="success">Current</Badge>}
                </div>
                <p className={`text-text-secondary text-sm leading-relaxed mb-4 ${i % 2 === 0 ? "md:text-right" : ""}`}>{exp.description}</p>
                {exp.techUsed?.length > 0 && (
                  <div className={`flex flex-wrap gap-1.5 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                    {exp.techUsed.map((t) => <span key={t} className="px-2 py-0.5 bg-surface-2 text-text-muted text-xs font-mono rounded">{t}</span>)}
                  </div>
                )}
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

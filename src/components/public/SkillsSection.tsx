"use client";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import SectionHeader from "./SectionHeader";
import { TECH_ICON_MAP } from "@/constants";
import type { ISkill } from "@/types";

export default function SkillsSection({ skills }: { skills: ISkill[] }) {
  if (!skills.length) return null;
  const grouped = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {} as Record<string, ISkill[]>);
  const order = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"];
  const sorted = Object.keys(grouped).sort((a, b) => order.indexOf(a) - order.indexOf(b));

  return (
    <section id="skills" className="section-padding bg-surface/30">
      <div className="section-container">
        <SectionHeader label="// skills" title="Technologies I Use" description="The tools and technologies I work with daily" />
        <div className="space-y-12">
          {sorted.map((category) => (
            <div key={category}>
              <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-lg font-semibold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-primary" /><span className="font-mono text-primary text-sm">{category}</span><span className="flex-1 h-px bg-border" />
              </motion.h3>
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {grouped[category].map((skill) => (
                  <StaggerItem key={skill._id}>
                    <motion.div whileHover={{ y: -5, scale: 1.02 }}
                      className="group bg-surface border border-border rounded-2xl p-5 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default">
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{TECH_ICON_MAP[skill.name] || skill.icon || "🔧"}</div>
                      <p className="text-sm font-medium mb-2 text-text-primary">{skill.name}</p>
                      <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.proficiency}%` }} viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
                      </div>
                      <p className="text-xs text-text-muted mt-1 font-mono">{skill.proficiency}%</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import Image from "next/image";
import { User, FolderGit2, Users, Award } from "lucide-react";
import MotionWrapper from "@/components/animations/MotionWrapper";
import CountUp from "@/components/animations/CountUp";
import SectionHeader from "./SectionHeader";
import type { ISiteSettings } from "@/types";

export default function About({ settings }: { settings: ISiteSettings | null }) {
  if (!settings) return null;
  const stats = [
    { icon: Award, value: settings.yearsOfExperience, label: "Years Experience", suffix: "+" },
    { icon: FolderGit2, value: settings.totalProjects, label: "Projects Done", suffix: "+" },
    { icon: Users, value: settings.totalClients, label: "Happy Clients", suffix: "+" },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="section-container">
        <SectionHeader label="// about me" title={settings.aboutTitle || "About Me"} />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <MotionWrapper direction="left">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl scale-105" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-border aspect-[4/5]">
                {settings.aboutImage ? <Image src={settings.aboutImage} alt="About me" fill className="object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><User className="w-24 h-24 text-text-muted" /></div>}
              </div>
              <div className="absolute -bottom-6 -right-6 bg-surface border border-border rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold gradient-text"><CountUp end={settings.yearsOfExperience} suffix="+" /></div>
                <p className="text-sm text-text-muted">Years of<br />Experience</p>
              </div>
            </div>
          </MotionWrapper>
          <MotionWrapper direction="right">
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full" /><span className="w-3 h-3 bg-yellow-500 rounded-full" /><span className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="ml-2 text-text-muted text-xs">about.ts</span>
                </div>
                <div className="text-text-secondary">
                  <span className="text-primary">const</span> <span className="text-secondary">developer</span> <span className="text-text-muted">=</span> <span className="text-accent">{"{"}</span><br />
                  <span className="ml-4">passion: <span className="text-green-400">&quot;Building things&quot;</span>,</span><br />
                  <span className="ml-4">focus: <span className="text-green-400">&quot;Full Stack Development&quot;</span>,</span><br />
                  <span className="ml-4">loves: <span className="text-green-400">&quot;Clean Code&quot;</span></span><br />
                  <span className="text-accent">{"}"}</span>
                </div>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                {settings.aboutDescription.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-surface border border-border rounded-2xl hover:border-primary/30 transition-colors">
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-text-primary"><CountUp end={stat.value} suffix={stat.suffix} /></div>
                    <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}

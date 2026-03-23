import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import ProjectsSection from "@/components/public/ProjectsSection";
import ExperienceTimeline from "@/components/public/ExperienceTimeline";
import SkillsSection from "@/components/public/SkillsSection";
import Testimonials from "@/components/public/Testimonials";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Testimonial from "@/models/Testimonial";
import Settings from "@/models/Settings";
import type { Metadata } from "next";

async function getData() {
  await connectDB();
  const [projects, experiences, skills, testimonials, settings] = await Promise.all([
    Project.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }).lean(),
    Experience.find({ isVisible: true }).sort({ order: 1, startDate: -1 }).lean(),
    Skill.find({ isVisible: true }).sort({ order: 1, category: 1 }).lean(),
    Testimonial.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }).lean(),
    Settings.findOne().lean(),
  ]);
  return {
    projects: JSON.parse(JSON.stringify(projects)),
    experiences: JSON.parse(JSON.stringify(experiences)),
    skills: JSON.parse(JSON.stringify(skills)),
    testimonials: JSON.parse(JSON.stringify(testimonials)),
    settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const s = await Settings.findOne().lean();
  return {
    title: s?.siteTitle || "Portfolio",
    description: s?.siteDescription || "Full Stack Developer Portfolio",
    openGraph: { title: s?.siteTitle || "Portfolio", description: s?.siteDescription || "", images: s?.ogImage ? [s.ogImage] : [] },
  };
}

export const revalidate = 60;

export default async function HomePage() {
  const { projects, experiences, skills, testimonials, settings } = await getData();
  return (
    <>
      <Navbar settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <ProjectsSection projects={projects} />
        <ExperienceTimeline experiences={experiences} />
        <SkillsSection skills={skills} />
        <Testimonials testimonials={testimonials} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

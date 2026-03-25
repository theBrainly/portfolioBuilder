import Navbar from "@/components/public/Navbar";
import PortfolioShell from "@/components/public/PortfolioShell";
import Hero from "@/components/public/Hero";
import LogoMarquee from "@/components/public/LogoMarquee";
import About from "@/components/public/About";
import ProjectsSection from "@/components/public/ProjectsSection";
import ExperienceTimeline from "@/components/public/ExperienceTimeline";
import SkillsSection from "@/components/public/SkillsSection";
import Testimonials from "@/components/public/Testimonials";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import {
  DEFAULT_HOME_SECTION_ORDER,
  type HomeSectionId,
} from "@/constants/siteCustomization";
import type {
  IExperience,
  IProject,
  ISiteSettings,
  ISkill,
  ITestimonial,
} from "@/types";

export default function PortfolioHomeContent({
  projects,
  experiences,
  skills,
  testimonials,
  settings,
}: {
  projects: IProject[];
  experiences: IExperience[];
  skills: ISkill[];
  testimonials: ITestimonial[];
  settings: ISiteSettings | null;
}) {
  const preset = settings?.designPreset;
  const orderedSections = (settings?.homeSectionOrder?.length
    ? settings.homeSectionOrder
    : DEFAULT_HOME_SECTION_ORDER
  ).map((sectionId: HomeSectionId) => {
    switch (sectionId) {
      case "logoMarquee":
        return <LogoMarquee key={sectionId} preset={preset} />;
      case "about":
        return <About key={sectionId} settings={settings} />;
      case "skills":
        return <SkillsSection key={sectionId} skills={skills} preset={preset} />;
      case "experience":
        return <ExperienceTimeline key={sectionId} experiences={experiences} preset={preset} />;
      case "projects":
        return (
          <ProjectsSection
            key={sectionId}
            projects={projects}
            preset={preset}
            settings={settings}
          />
        );
      case "testimonials":
        return (
          <Testimonials
            key={sectionId}
            testimonials={testimonials}
            projects={projects}
            preset={preset}
          />
        );
      case "contact":
        return <ContactSection key={sectionId} settings={settings} />;
      default:
        return null;
    }
  });

  return (
    <PortfolioShell settings={settings}>
      <Navbar settings={settings} />
      <main>
        <Hero settings={settings} />
        {orderedSections}
      </main>
      <Footer settings={settings} />
    </PortfolioShell>
  );
}

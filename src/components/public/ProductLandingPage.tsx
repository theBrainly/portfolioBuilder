"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  Globe,
  LayoutDashboard,
  Search,
  Palette,
  Mail,
  ChevronDown,
  Star,
  Check,
  Zap,
  Shield,
  Play,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react";

/* ───────────── Data ───────────── */

const features = [
  {
    icon: Users,
    title: "Multi-User Portfolios",
    description:
      "Every user gets their own isolated workspace — projects, skills, experience, inbox, and settings.",
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description:
      "Publish your portfolio on a unique slug like /your-name or connect a custom domain in seconds.",
  },
  {
    icon: LayoutDashboard,
    title: "Powerful Admin Panel",
    description:
      "Full CRUD dashboard to manage projects, experience, testimonials, skills, and site settings.",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description:
      "Auto-generated sitemaps, meta tags, OpenGraph images, and semantic HTML for top search rankings.",
  },
  {
    icon: Palette,
    title: "Design Presets",
    description:
      "Choose from multiple color palettes and design presets. Dark mode included out of the box.",
  },
  {
    icon: Mail,
    title: "Built-in Contact Inbox",
    description:
      "Receive client inquiries directly in your dashboard with email notifications and read tracking.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in 30 seconds. No credit card required. Get your own workspace instantly.",
  },
  {
    number: "02",
    title: "Customize Everything",
    description:
      "Add projects, experience, skills, and testimonials. Pick a color palette and design preset.",
  },
  {
    number: "03",
    title: "Publish & Share",
    description:
      "Go live on your unique URL. Share it with clients, recruiters, and the world.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Freelance Designer",
    avatar: "PS",
    content:
      "I had my portfolio live in under 10 minutes. The admin panel is incredibly intuitive — it honestly feels like a premium product.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Full-Stack Developer",
    avatar: "AC",
    content:
      "The multi-user architecture is brilliant. I recommended it to my entire team. Everyone has their own polished portfolio now.",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    role: "Product Manager",
    avatar: "MR",
    content:
      "Finally a portfolio builder that doesn't look like every other template. The design presets are gorgeous and the SEO is top-notch.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is it really free to get started?",
    a: "Yes! The free plan includes everything you need to build and publish a stunning portfolio. No credit card required, no time limit.",
  },
  {
    q: "Can I use my own custom domain?",
    a: "Absolutely. On the Pro plan you can connect any custom domain. Your portfolio will be served with HTTPS automatically.",
  },
  {
    q: "How is my data stored?",
    a: "All data is stored securely in MongoDB with per-user isolation. Your projects, settings, and messages are completely private to your account.",
  },
  {
    q: "Can I customize the design?",
    a: "Yes. Choose from multiple color palettes (Graphite, Ocean, Forest, Sunset, Rose), toggle dark/light mode, and reorder sections however you like.",
  },
  {
    q: "What tech stack does it use?",
    a: "Next.js 14 (App Router), TypeScript, Tailwind CSS, MongoDB, Framer Motion, and NextAuth. Deployed on Vercel for maximum performance.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not at all. The admin panel is a full visual CMS — add projects, write descriptions, upload images, and publish. Zero code required.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to launch your portfolio",
    features: [
      "Personal portfolio page",
      "Up to 10 projects",
      "Contact form & inbox",
      "5 design presets",
      "SEO optimized",
      "yourname.site slug",
    ],
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For professionals who want the full package",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Custom domain support",
      "Priority support",
      "Analytics dashboard",
      "Remove branding",
      "Custom fonts & themes",
    ],
    cta: "Upgrade to Pro",
    href: "/signup",
    highlighted: true,
  },
];

/* ───────────── Component ───────────── */

export default function ProductLandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(
      () => setActiveTestimonial((p) => (p + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1120] text-white">
      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-amber-500/[0.07] blur-[120px]" />
        <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-400/[0.04] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* ═══════════ NAVIGATION ═══════════ */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#0b1120]/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Portfolio Builder
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition-all hover:border-white/25 hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="group relative rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/40"
            >
              Get Started Free
              <ArrowRight className="ml-1.5 inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-white/[0.06] bg-[#0b1120]/95 backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-4 px-6 py-6">
                {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="rounded-full border border-white/10 px-5 py-2.5 text-center text-sm text-white/70"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-950"
                  >
                    Get Started Free
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative">
        {/* ═══════════ HERO ═══════════ */}
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:pt-40 lg:pt-44">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
              <Zap className="h-3 w-3" />
              Now in public beta — free to use
            </div>

            <h1 className="mt-8 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build a stunning portfolio
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                in minutes, not hours
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              The all-in-one platform where developers, designers, and freelancers
              create professional portfolios, manage projects, and land more
              clients&nbsp;— zero coding needed.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/40"
              >
                Start Building Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm text-white/70 transition-all hover:border-white/25 hover:text-white"
              >
                <Play className="h-3.5 w-3.5" />
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-indigo-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-cyan-400"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${bg} text-[10px] font-bold text-slate-900 ring-2 ring-[#0b1120]`}
                    >
                      {["AK", "PS", "MR", "JD", "LC"][i]}
                    </div>
                  )
                )}
              </div>
              <p className="text-sm text-white/40">
                Trusted by <span className="font-medium text-white/70">500+</span> developers &amp;
                freelancers
              </p>
            </div>
          </div>

          {/* Hero browser mockup */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 shadow-2xl shadow-black/40 backdrop-blur-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 rounded-t-xl border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-white/[0.05] px-3 py-1 text-xs text-white/30">
                  portfoliobuilder.app/akash-sharma
                </div>
              </div>
              {/* Mock content */}
              <div className="relative overflow-hidden rounded-b-xl bg-gradient-to-br from-[#0d1526] to-[#111827] p-6 sm:p-10">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                  <div>
                    <div className="mb-3 inline-block rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                      Full-Stack Developer
                    </div>
                    <h3 className="font-display text-2xl font-bold sm:text-3xl">
                      Hi, I&apos;m Akash Sharma
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">
                      I build exceptional digital experiences with modern web
                      technologies. Specializing in React, Next.js, and
                      Node.js.
                    </p>
                    <div className="mt-5 flex gap-3">
                      <div className="rounded-lg bg-amber-400/10 px-3 py-1.5 text-xs text-amber-300">
                        View Projects
                      </div>
                      <div className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50">
                        Contact Me
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Projects", value: "24+" },
                      { label: "Clients", value: "15+" },
                      { label: "Years Exp", value: "5+" },
                      { label: "Tech Stack", value: "12+" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center"
                      >
                        <p className="font-display text-xl font-bold text-amber-300">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[11px] text-white/40">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-amber-400/[0.08] blur-[60px]" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ LOGO MARQUEE ═══════════ */}
        <section className="relative border-y border-white/[0.04] bg-white/[0.01] py-8">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.25em] text-white/30">
            Built with technologies you love
          </p>
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
                "MongoDB",
                "Framer Motion",
                "Node.js",
                "Vercel",
                "NextAuth",
                "Cloudinary",
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
                "MongoDB",
                "Framer Motion",
                "Node.js",
                "Vercel",
                "NextAuth",
                "Cloudinary",
              ].map((tech, i) => (
                <span
                  key={i}
                  className="mx-8 inline-block font-display text-sm font-medium text-white/20"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b1120]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b1120]" />
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/80">
              Features
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                stand out online
              </span>
            </h2>
            <p className="mt-4 text-base text-white/50">
              No more juggling templates, hosting, and CMS tools. One platform
              to create, manage, and publish your portfolio.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-amber-300/20 hover:bg-white/[0.04]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300/[0.08] text-amber-300 transition-colors group-hover:bg-amber-300/[0.14]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {feature.description}
                </p>
                {/* Hover glow */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-amber-400/[0.06] opacity-0 blur-[40px] transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section id="how-it-works" className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/80">
              How It Works
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Live in{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                three easy steps
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-px w-full bg-gradient-to-r from-amber-300/20 to-transparent md:block" />
                )}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06]">
                  <span className="font-display text-2xl font-bold text-amber-300">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ SHOWCASE ═══════════ */}
        <section className="relative overflow-hidden border-y border-white/[0.04] bg-white/[0.01] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/80">
                  Powerful Dashboard
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Manage everything from
                  <br />
                  <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                    one place
                  </span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/50">
                  Your admin panel is a full-featured CMS. Add projects with
                  screenshots, write descriptions in markdown, manage your
                  experience timeline, and respond to client inquiries.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Drag & drop image uploads to Cloudinary",
                    "Rich project management with categories & tags",
                    "Real-time contact inbox with email alerts",
                    "Site settings, SEO, and social links in one page",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-white/60"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition-colors hover:text-amber-200"
                >
                  Try the dashboard free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Dashboard mock */}
              <div className="relative">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5 shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-400/60" />
                      <div className="h-2 w-2 rounded-full bg-amber-400/60" />
                      <div className="h-2 w-2 rounded-full bg-green-400/60" />
                    </div>
                    <span className="ml-2 text-[10px] text-white/25">
                      Admin Dashboard
                    </span>
                  </div>
                  <div className="rounded-b-xl bg-[#0d1526] p-5">
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Projects", val: "12", color: "text-indigo-400" },
                        { label: "Clients", val: "30", color: "text-emerald-400" },
                        { label: "Messages", val: "8", color: "text-amber-400" },
                        { label: "Views", val: "2.4k", color: "text-rose-400" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center"
                        >
                          <p className={`font-display text-lg font-bold ${s.color}`}>
                            {s.val}
                          </p>
                          <p className="text-[10px] text-white/35">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Recent projects */}
                    <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="mb-2 text-[11px] font-medium text-white/40">
                        Recent Projects
                      </p>
                      {["E-Commerce Platform", "SaaS Dashboard", "Mobile App"].map(
                        (p, i) => (
                          <div
                            key={p}
                            className="flex items-center justify-between border-b border-white/[0.04] py-2 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-white/[0.06]" />
                              <span className="text-xs text-white/60">{p}</span>
                            </div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] ${
                                i === 0
                                  ? "bg-emerald-400/10 text-emerald-400"
                                  : "bg-amber-400/10 text-amber-400"
                              }`}
                            >
                              {i === 0 ? "Published" : "Draft"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                {/* Decorative */}
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/[0.08] blur-[60px]" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ PRICING ═══════════ */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/80">
              Pricing
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base text-white/50">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all ${
                  plan.highlighted
                    ? "border-amber-300/30 bg-gradient-to-b from-amber-300/[0.06] to-transparent shadow-xl shadow-amber-500/[0.08]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute right-4 top-4 rounded-full bg-amber-300/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                    Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-white/50">
                  {plan.description}
                </p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-white/60"
                    >
                      <Check className="h-4 w-4 shrink-0 text-amber-300" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-amber-300 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25"
                      : "border border-white/10 text-white/80 hover:border-white/25"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="relative border-y border-white/[0.04] bg-white/[0.01] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/80">
                Testimonials
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Loved by creators
              </h2>
            </div>

            <div className="relative mx-auto mt-16 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center"
                >
                  <div className="mb-4 flex justify-center gap-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-300 text-amber-300"
                        />
                      )
                    )}
                  </div>
                  <p className="text-lg leading-relaxed text-white/70">
                    &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-xs font-bold text-slate-950">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {testimonials[activeTestimonial].name}
                      </p>
                      <p className="text-xs text-white/40">
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="mt-6 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeTestimonial
                        ? "w-6 bg-amber-300"
                        : "w-2 bg-white/20 hover:bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <div className="text-center">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300/80">
              FAQ
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Questions? Answered.
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition-colors hover:text-amber-200"
                >
                  {faq.q}
                  <ChevronDown
                    className={`ml-4 h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-6 pb-4 text-sm leading-relaxed text-white/50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-300/[0.06] via-transparent to-indigo-400/[0.06]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to build your
              <br />
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                dream portfolio?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
              Join hundreds of developers and freelancers who&apos;ve already
              created stunning portfolios. It takes less than 2 minutes to
              get started.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/40"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
              <Shield className="h-3 w-3" />
              No credit card required · Free forever plan available
            </p>
          </div>
        </section>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative border-t border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display text-sm font-semibold">
                Portfolio Builder
              </span>
            </div>

            <nav className="flex flex-wrap justify-center gap-6">
              {["Features", "Pricing", "FAQ", "Log In", "Sign Up"].map(
                (link) => (
                  <a
                    key={link}
                    href={
                      link === "Log In"
                        ? "/login"
                        : link === "Sign Up"
                        ? "/signup"
                        : `#${link.toLowerCase().replace(/ /g, "-")}`
                    }
                    className="text-sm text-white/40 transition-colors hover:text-white/70"
                  >
                    {link}
                  </a>
                )
              )}
            </nav>

            <div className="flex gap-4">
              {[
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white/25 transition-colors hover:text-white/50"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-6 text-center">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} Portfolio Builder. Built with Next.js
              · All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

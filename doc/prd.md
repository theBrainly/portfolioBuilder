

# Portfolio Website - Complete PRD & Planning Document

## Table of Contents

---

## 1. PROJECT OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    PORTFOLIO WEBSITE                         │
│                                                              │
│  PUBLIC SITE (Frontend)  ◄──►  ADMIN PANEL (Backend CMS)    │
│  ┌───────────────────┐        ┌───────────────────────┐     │
│  │ • Hero Section    │        │ • Dashboard           │     │
│  │ • About Me        │        │ • Manage Projects     │     │
│  │ • Projects        │   API  │ • Manage Experience   │     │
│  │ • Experience      │◄─────►│ • Manage Testimonials │     │
│  │ • Skills          │        │ • Manage Skills       │     │
│  │ • Testimonials    │        │ • Site Settings       │     │
│  │ • Contact         │        │ • Analytics           │     │
│  └───────────────────┘        └───────────────────────┘     │
│                                                              │
│  Tech: Next.js 14 (App Router) + MongoDB + NextAuth         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. TECH STACK DECISION

```
┌──────────────────────────────────────────────────────┐
│                   TECH STACK                          │
├──────────────┬───────────────────────────────────────┤
│ Framework    │ Next.js 14 (App Router)               │
│ Language     │ TypeScript                            │
│ Styling      │ Tailwind CSS + Framer Motion          │
│ Database     │ MongoDB (Mongoose ODM)                │
│ Auth         │ NextAuth.js (Credentials Provider)    │
│ File Upload  │ Cloudinary (project images)           │
│ Icons        │ Lucide React                          │
│ Forms        │ React Hook Form + Zod validation      │
│ State        │ Zustand (admin panel)                 │
│ Email        │ Nodemailer (contact form)             │
│ Deployment   │ Vercel                                │
│ Font         │ Inter + JetBrains Mono (code feel)    │
└──────────────┴───────────────────────────────────────┘
```

---

## 3. SITEMAP & PAGE STRUCTURE

```
portfolio/
│
├── PUBLIC PAGES (/)
│   ├── / ........................ Home (Single Page with sections)
│   │   ├── #hero ............... Hero/Landing
│   │   ├── #about .............. About Me
│   │   ├── #projects ........... Projects Grid
│   │   ├── #experience ......... Timeline
│   │   ├── #skills ............. Skills & Tech
│   │   ├── #testimonials ....... Client Reviews
│   │   ├── #stats .............. Numbers/Stats
│   │   └── #contact ............ Contact Form
│   │
│   ├── /projects/[slug] ........ Project Detail Page
│   └── /resume ................. Downloadable Resume
│
├── ADMIN PAGES (/admin)
│   ├── /admin/login ............ Login Page
│   ├── /admin/dashboard ........ Overview Dashboard
│   ├── /admin/projects ......... CRUD Projects
│   ├── /admin/projects/new ..... Add Project
│   ├── /admin/projects/[id] .... Edit Project
│   ├── /admin/experience ....... CRUD Experience
│   ├── /admin/skills ........... Manage Skills
│   ├── /admin/testimonials ..... Manage Testimonials
│   ├── /admin/settings ......... Site Settings (hero text, about, resume)
│   └── /admin/messages ......... Contact Form Submissions
│
└── API ROUTES (/api)
    ├── /api/auth/[...nextauth]
    ├── /api/projects
    ├── /api/projects/[id]
    ├── /api/experience
    ├── /api/skills
    ├── /api/testimonials
    ├── /api/contact
    ├── /api/settings
    ├── /api/upload
    └── /api/dashboard/stats
```

---

## 4. DATABASE SCHEMA

```typescript
// ==================== SCHEMAS ====================

// 1. PROJECT
{
  _id: ObjectId,
  title: "E-Commerce Platform",
  slug: "e-commerce-platform",          // auto-generated
  shortDescription: "A full-stack...",   // for card
  longDescription: "Detailed markdown...", // for detail page
  thumbnail: "cloudinary-url",
  images: ["url1", "url2", "url3"],      // gallery
  techStack: ["Next.js", "Node.js", "MongoDB"],
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile",
  liveUrl: "https://...",
  githubUrl: "https://...",
  clientName: "John Doe",               // optional
  completionDate: Date,
  isFeatured: boolean,                  // show on hero
  isVisible: boolean,                   // draft/publish
  order: number,                        // sort order
  createdAt: Date,
  updatedAt: Date
}

// 2. EXPERIENCE
{
  _id: ObjectId,
  company: "Tech Corp",
  position: "Senior Developer",
  type: "Full Time" | "Freelance" | "Contract" | "Internship",
  startDate: Date,
  endDate: Date | null,                 // null = current
  isCurrent: boolean,
  description: "Led team of...",
  responsibilities: ["Built...", "Managed..."],
  techUsed: ["React", "AWS"],
  companyLogo: "url",
  companyUrl: "https://...",
  order: number,
  isVisible: boolean,
  createdAt: Date
}

// 3. SKILL
{
  _id: ObjectId,
  name: "React.js",
  icon: "react",                        // icon identifier
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools",
  proficiency: 90,                      // 0-100
  order: number,
  isVisible: boolean
}

// 4. TESTIMONIAL
{
  _id: ObjectId,
  clientName: "Jane Smith",
  clientPosition: "CEO at StartupX",
  clientImage: "url",
  content: "Amazing developer...",
  rating: 5,                            // 1-5
  projectId: ObjectId | null,           // link to project
  isVisible: boolean,
  order: number,
  createdAt: Date
}

// 5. CONTACT MESSAGE
{
  _id: ObjectId,
  name: "Visitor Name",
  email: "visitor@email.com",
  subject: "Project Inquiry",
  message: "I want to build...",
  isRead: boolean,
  isStarred: boolean,
  repliedAt: Date | null,
  createdAt: Date
}

// 6. SITE SETTINGS (single document)
{
  _id: ObjectId,
  // Hero Section
  heroTitle: "Hi, I'm [Name]",
  heroSubtitle: "Full Stack Developer",
  heroDescription: "I build...",
  heroCTA: "View My Work",
  heroImage: "url",
  
  // About Section
  aboutTitle: "About Me",
  aboutDescription: "Detailed bio...",
  aboutImage: "url",
  yearsOfExperience: 5,
  totalProjects: 50,
  totalClients: 30,
  
  // Contact Section
  email: "your@email.com",
  phone: "+1234567890",
  location: "City, Country",
  
  // Social Links
  github: "https://...",
  linkedin: "https://...",
  twitter: "https://...",
  
  // Resume
  resumeUrl: "cloudinary-url",
  
  // SEO
  siteTitle: "Portfolio",
  siteDescription: "...",
  ogImage: "url"
}

// 7. ADMIN USER
{
  _id: ObjectId,
  email: "admin@email.com",
  password: "hashed",                   // bcrypt
  name: "Your Name",
  role: "admin",
  createdAt: Date
}
```

---

## 5. UI/UX DESIGN SYSTEM

### 5.1 Color Palette Options

```
OPTION A: "Midnight Developer" (Dark Theme Primary)
┌─────────────────────────────────────────────────────┐
│                                                      │
│  Background     #0A0A0B  ████████  Deep Black        │
│  Surface        #111113  ████████  Card Background   │
│  Surface 2      #1A1A1F  ████████  Elevated Surface  │
│  Border         #2A2A30  ████████  Subtle Border     │
│                                                      │
│  Primary        #6C63FF  ████████  Purple Accent     │
│  Primary Light  #8B83FF  ████████  Hover State       │
│  Secondary      #00D4AA  ████████  Teal/Green        │
│  Accent         #FF6B6B  ████████  Red Accent        │
│                                                      │
│  Text Primary   #FFFFFF  ████████  White             │
│  Text Secondary #A0A0B0  ████████  Muted Text        │
│  Text Muted     #606070  ████████  Subtle Text       │
│                                                      │
│  Gradient:  #6C63FF → #00D4AA (Primary gradient)     │
│  Glow:      rgba(108,99,255,0.15)                    │
└─────────────────────────────────────────────────────┘

OPTION B: "Ocean Noir" (Dark + Blue)
┌─────────────────────────────────────────────────────┐
│  Background     #0B1121  ████████                    │
│  Surface        #111B2E  ████████                    │
│  Primary        #3B82F6  ████████  Blue              │
│  Secondary      #10B981  ████████  Emerald           │
│  Accent         #F59E0B  ████████  Amber             │
└─────────────────────────────────────────────────────┘

OPTION C: "Minimal Mono" (Clean + Minimal)
┌─────────────────────────────────────────────────────┐
│  Background     #FAFAFA  ████████  Light             │
│  Dark BG        #09090B  ████████  Dark mode         │
│  Primary        #18181B  ████████  Near Black        │
│  Accent         #6366F1  ████████  Indigo            │
│  Secondary      #EC4899  ████████  Pink              │
└─────────────────────────────────────────────────────┘
```

### 5.2 Typography System

```
┌─────────────────────────────────────────────────────┐
│  TYPOGRAPHY SCALE                                    │
├──────────────┬──────────┬───────────────────────────┤
│  Element     │  Size    │  Font                      │
├──────────────┼──────────┼───────────────────────────┤
│  Hero Title  │  64-80px │  Inter Bold (900)          │
│  H1          │  48px    │  Inter Bold (700)          │
│  H2          │  36px    │  Inter SemiBold (600)      │
│  H3          │  24px    │  Inter SemiBold (600)      │
│  H4          │  20px    │  Inter Medium (500)        │
│  Body        │  16px    │  Inter Regular (400)       │
│  Small       │  14px    │  Inter Regular (400)       │
│  Caption     │  12px    │  Inter Medium (500)        │
│  Code/Tech   │  14px    │  JetBrains Mono (400)     │
│  Nav Links   │  15px    │  Inter Medium (500)        │
└──────────────┴──────────┴───────────────────────────┘
```

### 5.3 Spacing System (8px grid)

```
┌─────────────────────────────────────────────────────┐
│  xs:  4px   │  sm:  8px   │  md:  16px              │
│  lg: 24px   │  xl: 32px   │  2xl: 48px              │
│  3xl: 64px  │  4xl: 96px  │  5xl: 128px             │
│                                                      │
│  Section Padding:  80px-120px vertical               │
│  Container Max:    1280px                            │
│  Card Radius:      12px-16px                         │
│  Button Radius:    8px                               │
└─────────────────────────────────────────────────────┘
```

---

## 6. WIREFRAME - PUBLIC WEBSITE SECTIONS

### 6.1 Navigation

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo/Name]     About  Projects  Experience  Contact    [☀/🌙]│
│                                                              │
│  Mobile: [Logo/Name]                            [☰ Hamburger]│
└──────────────────────────────────────────────────────────────┘

- Sticky on scroll (with backdrop blur)
- Active section highlighting
- Smooth scroll to sections
- Dark/Light mode toggle
```

### 6.2 Hero Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│     ✋ Hi, I'm                                   ┌────────┐  │
│                                                  │        │  │
│     [YOUR NAME]                                  │  3D    │  │
│     ═══════════════                              │ Avatar │  │
│     Full Stack Developer                         │  or    │  │
│                                                  │ Photo  │  │
│     I build exceptional digital experiences      │        │  │
│     that live on the internet.                   └────────┘  │
│                                                              │
│     [View My Work ↓]    [Download CV ↓]                      │
│                                                              │
│     ── GitHub  ── LinkedIn  ── Twitter                       │
│                                                              │
│     ┌─────┐  ┌─────┐  ┌─────┐                              │
│     │ 50+ │  │ 30+ │  │ 5+  │                              │
│     │Proj │  │Clie │  │Years│                              │
│     └─────┘  └─────┘  └─────┘                              │
│                                                              │
│  ░░░░░░░░░  Animated particles/grid background  ░░░░░░░░░░  │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 About Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ─── ABOUT ME                                            │
│                                                              │
│  ┌──────────┐    I'm a passionate developer based in        │
│  │          │    [City]. With [X] years of experience,       │
│  │  Photo   │    I specialize in building full-stack         │
│  │  with    │    web applications.                           │
│  │  border  │                                                │
│  │  glow    │    I've worked with [X]+ clients and           │
│  │          │    delivered [X]+ projects across various       │
│  └──────────┘    industries including fintech, e-commerce,   │
│                  and SaaS platforms.                          │
│                                                              │
│     When I'm not coding, you can find me [hobbies].         │
│                                                              │
│     ┌─────────────────────────────────────────────┐         │
│     │  🎯 5+ Years  │  📦 50+ Projects  │  👥 30+ Clients │ │
│     └─────────────────────────────────────────────┘         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.4 Projects Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ─── MY PROJECTS                                         │
│                                                              │
│     [All] [Full Stack] [Frontend] [Backend] [Mobile]  ← tabs│
│                                                              │
│     ┌──────────────────┐  ┌──────────────────┐              │
│     │ ┌──────────────┐ │  │ ┌──────────────┐ │              │
│     │ │              │ │  │ │              │ │              │
│     │ │  Screenshot  │ │  │ │  Screenshot  │ │              │
│     │ │              │ │  │ │              │ │              │
│     │ └──────────────┘ │  │ └──────────────┘ │              │
│     │                  │  │                  │              │
│     │  Project Title   │  │  Project Title   │              │
│     │  Short desc...   │  │  Short desc...   │              │
│     │                  │  │                  │              │
│     │  [React] [Node]  │  │  [Vue] [Python]  │              │
│     │                  │  │                  │              │
│     │  [Live↗] [Code↗] │  │  [Live↗] [Code↗] │              │
│     └──────────────────┘  └──────────────────┘              │
│                                                              │
│     ┌──────────────────┐  ┌──────────────────┐              │
│     │     Card 3       │  │     Card 4       │              │
│     └──────────────────┘  └──────────────────┘              │
│                                                              │
│              [View All Projects →]                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘

PROJECT DETAIL PAGE (/projects/[slug]):
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Projects                                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │                                                    │     │
│  │              Hero Image / Screenshot               │     │
│  │                                                    │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Project Title                          [Live ↗] [GitHub ↗] │
│  Client: John Doe  |  Date: Jan 2024                        │
│                                                              │
│  ── Tech Stack                                              │
│  [React] [Node.js] [MongoDB] [AWS]                          │
│                                                              │
│  ── Description                                             │
│  Full markdown rendered description...                       │
│                                                              │
│  ── Gallery                                                 │
│  [img1] [img2] [img3] (lightbox on click)                   │
│                                                              │
│  ── More Projects                                           │
│  [Card] [Card] [Card]                                       │
└──────────────────────────────────────────────────────────────┘
```

### 6.5 Experience Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ─── EXPERIENCE                                          │
│                                                              │
│     [Work Experience]  [Education]  ← tabs                  │
│                                                              │
│            ┌─────────────────────────────────┐              │
│     2024   │  Senior Developer               │              │
│      ●─────│  Tech Corp Inc.                 │              │
│     Present│  • Led team of 5 developers     │              │
│            │  • Built microservices platform  │              │
│            │  [React] [AWS] [Docker]         │              │
│            └─────────────────────────────────┘              │
│            │                                                │
│            ┌─────────────────────────────────┐              │
│     2022   │  Full Stack Developer            │              │
│      ●─────│  StartupX                       │              │
│     2024   │  • Developed SaaS platform      │              │
│            │  • Increased performance 40%     │              │
│            │  [Next.js] [Node] [PostgreSQL]   │              │
│            └─────────────────────────────────┘              │
│            │                                                │
│            ┌─────────────────────────────────┐              │
│     2020   │  Junior Developer               │              │
│      ●─────│  Agency Co.                     │              │
│     2022   │  • Built client websites        │              │
│            └─────────────────────────────────┘              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.6 Skills Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ─── SKILLS & TECHNOLOGIES                               │
│                                                              │
│     Frontend                                                │
│     ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│     │ ⚛️     │ │ ▲      │ │ 🟦     │ │ 🎨     │           │
│     │ React  │ │Next.js │ │  TS    │ │Tailwind│           │
│     │  90%   │ │  85%   │ │  88%   │ │  95%   │           │
│     └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                              │
│     Backend                                                 │
│     ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│     │ 🟢     │ │ 🐍     │ │ ☕     │ │ 🔥     │           │
│     │Node.js │ │Python  │ │Express │ │GraphQL │           │
│     │  85%   │ │  70%   │ │  85%   │ │  75%   │           │
│     └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                              │
│     Database & DevOps                                       │
│     ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│     │ 🍃     │ │ 🐘     │ │ 🐳     │ │ ☁️     │           │
│     │MongoDB │ │Postgre │ │Docker  │ │  AWS   │           │
│     └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.7 Testimonials Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ─── WHAT CLIENTS SAY                                    │
│                                                              │
│  ← ┌──────────────────────────────────────────────────┐ →   │
│    │  "                                                │     │
│    │  Amazing developer! Delivered the project         │     │
│    │  ahead of schedule with exceptional quality.      │     │
│    │  Would definitely work with again.                │     │
│    │  "                                                │     │
│    │                                                   │     │
│    │  ┌──────┐  Jane Smith                            │     │
│    │  │ IMG  │  CEO, StartupX                         │     │
│    │  └──────┘  ★★★★★                                │     │
│    └──────────────────────────────────────────────────┘     │
│                                                              │
│    ● ○ ○ ○  (carousel dots)                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.8 Contact Section

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ─── GET IN TOUCH                                        │
│                                                              │
│     ┌──────────────────────┐  ┌──────────────────────┐     │
│     │                      │  │                      │     │
│     │  Let's work          │  │  Name: [________]    │     │
│     │  together!           │  │                      │     │
│     │                      │  │  Email: [________]   │     │
│     │  📧 email@mail.com   │  │                      │     │
│     │  📱 +1234567890      │  │  Subject: [________] │     │
│     │  📍 City, Country    │  │                      │     │
│     │                      │  │  Message:            │     │
│     │  [GitHub] [LinkedIn] │  │  [________________]  │     │
│     │  [Twitter]           │  │  [________________]  │     │
│     │                      │  │  [________________]  │     │
│     │                      │  │                      │     │
│     │                      │  │  [Send Message →]    │     │
│     └──────────────────────┘  └──────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.9 Footer

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     [Logo/Name]                                             │
│                                                              │
│     Built with ❤️ using Next.js                              │
│                                                              │
│     [GitHub]  [LinkedIn]  [Twitter]  [Email]                │
│                                                              │
│     © 2024 Your Name. All rights reserved.                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. ADMIN PANEL WIREFRAMES

### 7.1 Admin Login

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              ┌──────────────────────┐                       │
│              │                      │                       │
│              │     🔐 Admin Login    │                       │
│              │                      │                       │
│              │  Email:              │                       │
│              │  [________________]  │                       │
│              │                      │                       │
│              │  Password:           │                       │
│              │  [________________]  │                       │
│              │                      │                       │
│              │  [   Sign In    →]   │                       │
│              │                      │                       │
│              └──────────────────────┘                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Admin Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                               │
│  │ SIDEBAR  │   DASHBOARD                          [Logout] │
│  │          │                                               │
│  │ 📊 Dash  │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ 📁 Proj  │   │  12  │ │  30  │ │   5  │ │   8  │      │
│  │ 💼 Exp   │   │ Proj │ │Client│ │ Yrs  │ │ Msgs │      │
│  │ 🛠 Skill │   └──────┘ └──────┘ └──────┘ └──────┘      │
│  │ 💬 Test  │                                               │
│  │ ✉️ Msgs  │   Recent Messages         Recent Projects     │
│  │ ⚙️ Set   │   ┌──────────────┐       ┌──────────────┐   │
│  │          │   │ John - New   │       │ Project A    │   │
│  │          │   │ inquiry...   │       │ Updated 2d   │   │
│  │          │   │ Jane - Help  │       │ Project B    │   │
│  │          │   │ with app...  │       │ Updated 5d   │   │
│  │          │   └──────────────┘       └──────────────┘   │
│  └──────────┘                                               │
└──────────────────────────────────────────────────────────────┘
```

### 7.3 Admin - Manage Projects

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR │   PROJECTS                    [+ Add New Project] │
│          │                                                   │
│          │   Search: [____________]  Filter: [All ▼]        │
│          │                                                   │
│          │   ┌──────────────────────────────────────────┐   │
│          │   │  IMG │ Title      │ Category │ Status │ ⚙️  │ │
│          │   │──────┼────────────┼──────────┼────────┼────│ │
│          │   │ [📷] │ Project A  │ FullStack│ ✅ Live │ ✏️🗑│ │
│          │   │ [📷] │ Project B  │ Frontend │ 📝Draft│ ✏️🗑│ │
│          │   │ [📷] │ Project C  │ Backend  │ ✅ Live │ ✏️🗑│ │
│          │   │ [📷] │ Project D  │ Mobile   │ ✅ Live │ ✏️🗑│ │
│          │   └──────────────────────────────────────────┘   │
│          │                                                   │
│          │   Showing 1-10 of 12    [← 1 2 →]               │
└──────────────────────────────────────────────────────────────┘
```

### 7.4 Admin - Add/Edit Project Form

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR │   ADD NEW PROJECT                      [Save] [×]│
│          │                                                   │
│          │   Title *                                         │
│          │   [____________________________________]          │
│          │                                                   │
│          │   Short Description *                             │
│          │   [____________________________________]          │
│          │                                                   │
│          │   Full Description (Markdown)                     │
│          │   ┌────────────────────────────────────┐         │
│          │   │  Rich text editor / Markdown       │         │
│          │   │                                    │         │
│          │   └────────────────────────────────────┘         │
│          │                                                   │
│          │   Thumbnail *          Additional Images          │
│          │   ┌──────────┐        ┌──────────────────┐      │
│          │   │ Drop img │        │ [+] [img] [img]  │      │
│          │   │ or click │        │                  │      │
│          │   └──────────┘        └──────────────────┘      │
│          │                                                   │
│          │   Category *              Tech Stack *            │
│          │   [Full Stack ▼]         [React] [Node] [+Add]   │
│          │                                                   │
│          │   Live URL                GitHub URL              │
│          │   [________________]     [________________]      │
│          │                                                   │
│          │   Client Name             Completion Date        │
│          │   [________________]     [________________]      │
│          │                                                   │
│          │   ☑ Featured   ☑ Visible                         │
│          │                                                   │
│          │   [Cancel]                    [Save Project →]    │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. ANIMATIONS & INTERACTIONS

```
┌──────────────────────────────────────────────────────────────┐
│  ANIMATION SPECS                                             │
├────────────────────────┬─────────────────────────────────────┤
│  Page Load             │ Staggered fade-in from bottom       │
│  Section Entry         │ Fade up on scroll (IntersectionObs) │
│  Project Cards         │ Scale 1.02 + shadow on hover        │
│  Project Card Image    │ Slight zoom on hover (scale 1.05)   │
│  Nav Links             │ Underline slide animation           │
│  Buttons               │ Scale 0.98 on click, glow on hover  │
│  Skills Icons          │ Float animation (subtle up/down)    │
│  Timeline              │ Draw line on scroll                 │
│  Stats Numbers         │ Count-up animation on view          │
│  Testimonial           │ Carousel with slide transition      │
│  Page Transitions      │ Smooth opacity + translateY         │
│  Cursor                │ Custom cursor (optional)            │
│  Background            │ Subtle gradient mesh / particles    │
│  Dark/Light Toggle     │ Smooth color transition 300ms       │
│  Loading States        │ Skeleton loaders                    │
├────────────────────────┼─────────────────────────────────────┤
│  Library               │ Framer Motion                       │
│  Duration              │ 300-600ms                           │
│  Easing                │ cubic-bezier(0.16, 1, 0.3, 1)      │
└────────────────────────┴─────────────────────────────────────┘
```

---

## 9. API ROUTES SPECIFICATION

```
┌──────────────────────────────────────────────────────────────┐
│  API ENDPOINTS                                               │
├──────────────────────────┬───────┬───────────────────────────┤
│  ENDPOINT                │METHOD │ DESCRIPTION               │
├──────────────────────────┼───────┼───────────────────────────┤
│  PUBLIC APIs (no auth)                                       │
├──────────────────────────┼───────┼───────────────────────────┤
│  /api/projects           │ GET   │ List visible projects     │
│  /api/projects/[slug]    │ GET   │ Single project by slug    │
│  /api/experience         │ GET   │ List visible experience   │
│  /api/skills             │ GET   │ List visible skills       │
│  /api/testimonials       │ GET   │ List visible testimonials │
│  /api/settings           │ GET   │ Get site settings         │
│  /api/contact            │ POST  │ Submit contact form       │
├──────────────────────────┼───────┼───────────────────────────┤
│  ADMIN APIs (auth required)                                  │
├──────────────────────────┼───────┼───────────────────────────┤
│  /api/auth/[...nextauth] │ *     │ NextAuth handlers         │
│  /api/admin/projects     │ GET   │ All projects (inc drafts) │
│  /api/admin/projects     │ POST  │ Create project            │
│  /api/admin/projects/[id]│ PUT   │ Update project            │
│  /api/admin/projects/[id]│DELETE │ Delete project            │
│  /api/admin/experience   │ POST  │ Create experience         │
│  /api/admin/experience/…│ PUT   │ Update experience         │
│  /api/admin/experience/…│DELETE │ Delete experience         │
│  /api/admin/skills       │ POST  │ Create skill              │
│  /api/admin/skills/[id]  │ PUT   │ Update skill              │
│  /api/admin/skills/[id]  │DELETE │ Delete skill              │
│  /api/admin/testimonials │ POST  │ Create testimonial        │
│  /api/admin/testimonials…│ PUT   │ Update testimonial        │
│  /api/admin/testimonials…│DELETE │ Delete testimonial        │
│  /api/admin/settings     │ PUT   │ Update site settings      │
│  /api/admin/messages     │ GET   │ List contact messages     │
│  /api/admin/messages/[id]│ PUT   │ Mark read/starred         │
│  /api/admin/messages/[id]│DELETE │ Delete message            │
│  /api/admin/upload       │ POST  │ Upload image (Cloudinary) │
│  /api/admin/stats        │ GET   │ Dashboard statistics      │
└──────────────────────────┴───────┴───────────────────────────┘
```

---

## 10. PROJECT FOLDER STRUCTURE

```
portfolio/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── default-avatar.png
│   │   └── og-image.png
│   └── resume.pdf
│
├── src/
│   ├── app/
│   │   ├── (public)/                    # Public layout group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Home page (all sections)
│   │   │   └── projects/
│   │   │       └── [slug]/
│   │   │           └── page.tsx         # Project detail
│   │   │
│   │   ├── admin/                       # Admin layout group
│   │   │   ├── layout.tsx               # Admin sidebar layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx             # List
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx         # Create
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Edit
│   │   │   ├── experience/
│   │   │   │   └── page.tsx
│   │   │   ├── skills/
│   │   │   │   └── page.tsx
│   │   │   ├── testimonials/
│   │   │   │   └── page.tsx
│   │   │   ├── messages/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── projects/
│   │   │   │   ├── route.ts             # GET (public)
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts
│   │   │   ├── experience/
│   │   │   │   └── route.ts
│   │   │   ├── skills/
│   │   │   │   └── route.ts
│   │   │   ├── testimonials/
│   │   │   │   └── route.ts
│   │   │   ├── contact/
│   │   │   │   └── route.ts
│   │   │   ├── settings/
│   │   │   │   └── route.ts
│   │   │   └── admin/                   # Protected admin APIs
│   │   │       ├── projects/
│   │   │       │   ├── route.ts         # GET all, POST
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts     # PUT, DELETE
│   │   │       ├── experience/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── skills/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── testimonials/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── messages/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts
│   │   │       ├── settings/
│   │   │       │   └── route.ts
│   │   │       ├── upload/
│   │   │       │   └── route.ts
│   │   │       └── stats/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx                   # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── public/                      # Public site components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── ProjectsGrid.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ExperienceTimeline.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── StatsCounter.tsx
│   │   │   └── SectionHeader.tsx
│   │   │
│   │   ├── admin/                       # Admin components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ExperienceForm.tsx
│   │   │   ├── SkillForm.tsx
│   │   │   ├── TestimonialForm.tsx
│   │   │   ├── SettingsForm.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   └── MessageCard.tsx
│   │   │
│   │   └── ui/                          # Shared UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Switch.tsx
│   │       └── Spinner.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                        # MongoDB connection
│   │   ├── auth.ts                      # NextAuth config
│   │   ├── cloudinary.ts               # Upload helper
│   │   ├── email.ts                     # Nodemailer config
│   │   ├── validations.ts              # Zod schemas
│   │   └── utils.ts                     # Helper functions
│   │
│   ├── models/                          # Mongoose models
│   │   ├── Project.ts
│   │   ├── Experience.ts
│   │   ├── Skill.ts
│   │   ├── Testimonial.ts
│   │   ├── Message.ts
│   │   ├── Settings.ts
│   │   └── User.ts
│   │
│   ├── hooks/                           # Custom hooks
│   │   ├── useScrollSpy.ts
│   │   ├── useInView.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── store/                           # Zustand stores
│   │   └── adminStore.ts
│   │
│   ├── types/                           # TypeScript types
│   │   └── index.ts
│   │
│   └── constants/
│       └── index.ts                     # Static data
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 11. ENVIRONMENT VARIABLES

```env
# .env.local

# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_TO=your-email@gmail.com

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 12. RESPONSIVE BREAKPOINTS

```
┌──────────────────────────────────────────────────────────────┐
│  BREAKPOINTS                                                 │
├──────────────┬───────────────────────────────────────────────┤
│  Mobile      │  < 640px    (1 column, hamburger menu)       │
│  Tablet      │  640-1024px (2 columns, adjusted spacing)    │
│  Desktop     │  1024-1280px (full layout)                    │
│  Large       │  > 1280px   (max-width container)            │
├──────────────┴───────────────────────────────────────────────┤
│                                                              │
│  PROJECT GRID:                                              │
│  Mobile:  1 column                                          │
│  Tablet:  2 columns                                         │
│  Desktop: 2-3 columns                                       │
│                                                              │
│  SKILLS GRID:                                               │
│  Mobile:  2 columns                                         │
│  Tablet:  3 columns                                         │
│  Desktop: 4-6 columns                                       │
│                                                              │
│  ADMIN SIDEBAR:                                             │
│  Mobile:  Hidden (hamburger toggle)                         │
│  Desktop: Fixed 250px sidebar                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 13. DEVELOPMENT PHASES

```
┌──────────────────────────────────────────────────────────────┐
│  PHASE 1: Foundation (Days 1-3)                              │
│  ├── Project setup (Next.js, Tailwind, TypeScript)          │
│  ├── MongoDB connection + Mongoose models                    │
│  ├── NextAuth setup (admin authentication)                   │
│  ├── Cloudinary integration                                  │
│  ├── Base UI components (Button, Input, Card, etc.)         │
│  └── Admin layout (sidebar, header)                          │
│                                                              │
│  PHASE 2: Admin Panel (Days 4-7)                             │
│  ├── Admin login page                                        │
│  ├── Dashboard with stats                                    │
│  ├── Projects CRUD (form + table + image upload)            │
│  ├── Experience CRUD                                         │
│  ├── Skills CRUD                                             │
│  ├── Testimonials CRUD                                       │
│  ├── Messages management                                     │
│  ├── Site settings page                                      │
│  └── All API routes                                          │
│                                                              │
│  PHASE 3: Public Website (Days 8-12)                         │
│  ├── Navbar with scroll spy                                  │
│  ├── Hero section with animations                            │
│  ├── About section                                           │
│  ├── Projects grid with filters                              │
│  ├── Project detail page                                     │
│  ├── Experience timeline                                     │
│  ├── Skills section                                          │
│  ├── Testimonials carousel                                   │
│  ├── Contact form with email                                 │
│  ├── Footer                                                  │
│  └── Dark/Light mode                                         │
│                                                              │
│  PHASE 4: Polish (Days 13-15)                                │
│  ├── Animations (Framer Motion)                              │
│  ├── SEO (meta tags, OG images, sitemap)                    │
│  ├── Performance optimization                                │
│  ├── Responsive testing                                      │
│  ├── Loading states & error handling                         │
│  ├── Seed script (initial data)                              │
│  └── Deploy to Vercel                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 14. UNIQUE DESIGN ELEMENTS

```
┌──────────────────────────────────────────────────────────────┐
│  WHAT MAKES THIS PORTFOLIO UNIQUE                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 🎨 ANIMATED GRADIENT MESH BACKGROUND                    │
│     - Subtle moving gradient blobs behind hero               │
│     - Creates depth without distraction                      │
│                                                              │
│  2. 💻 CODE-THEMED SECTION HEADERS                           │
│     - "const aboutMe = {" style headers                      │
│     - JetBrains Mono for tech labels                         │
│                                                              │
│  3. 📊 LIVE STATS FROM DATABASE                              │
│     - Real project count, client count from DB               │
│     - Count-up animation                                     │
│                                                              │
│  4. 🖱️ MAGNETIC CURSOR EFFECT (desktop)                      │
│     - Buttons/links slightly attract cursor                  │
│                                                              │
│  5. 📱 TERMINAL-STYLE ABOUT SECTION                          │
│     - "$ whoami" styled introduction                         │
│     - Typing animation                                       │
│                                                              │
│  6. 🌊 SMOOTH PAGE TRANSITIONS                               │
│     - Sections reveal on scroll                              │
│     - Staggered children animations                          │
│                                                              │
│  7. 🔄 REAL-TIME ADMIN UPDATES                               │
│     - Changes reflect immediately on public site             │
│     - ISR (Incremental Static Regeneration)                  │
│                                                              │
│  8. 📍 INTERACTIVE PROJECT CARDS                              │
│     - 3D tilt effect on hover                                │
│     - Glassmorphism card design                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 15. SECURITY CHECKLIST

```
┌──────────────────────────────────────────────────────────────┐
│  SECURITY                                                    │
├──────────────────────────────────────────────────────────────┤
│  ✅ Admin routes protected with NextAuth middleware          │
│  ✅ API routes verify session before mutations               │
│  ✅ Passwords hashed with bcrypt                             │
│  ✅ Input validation with Zod on all forms                   │
│  ✅ Rate limiting on contact form API                        │
│  ✅ CSRF protection via NextAuth                             │
│  ✅ Sanitize HTML in descriptions (DOMPurify)               │
│  ✅ Image upload size limits (5MB)                           │
│  ✅ Environment variables for all secrets                    │
│  ✅ MongoDB injection prevention (Mongoose)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 16. SEO REQUIREMENTS

```
┌──────────────────────────────────────────────────────────────┐
│  SEO CHECKLIST                                               │
├──────────────────────────────────────────────────────────────┤
│  ✅ Dynamic meta tags per page                               │
│  ✅ Open Graph tags (title, description, image)             │
│  ✅ Twitter Card meta tags                                   │
│  ✅ Structured data (JSON-LD) - Person schema               │
│  ✅ Auto-generated sitemap.xml                               │
│  ✅ robots.txt                                               │
│  ✅ Canonical URLs                                           │
│  ✅ Alt text for all images                                  │
│  ✅ Semantic HTML (header, main, section, article)          │
│  ✅ Performance > 90 Lighthouse score                        │
└──────────────────────────────────────────────────────────────┘
```

---

## NEXT STEP: SHALL WE START BUILDING?

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   This PRD covers everything. Pick where to start:          │
│                                                              │
│   OPTION A → Start with Phase 1 (Setup + DB + Auth)         │
│   OPTION B → Start with Admin Panel first                    │
│   OPTION C → Start with Public Frontend first                │
│   OPTION D → Start with full code (I build everything)      │
│                                                              │
│   My Recommendation: OPTION A → B → C → D (sequential)     │
│   Because admin panel lets you ADD data first,               │
│   then public site DISPLAYS that data.                       │
│                                                              │
│   Tell me:                                                   │
│   1. Which color palette? (A, B, or C)                      │
│   2. Your name & details for the portfolio                   │
│   3. Which phase to start building?                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

This is your **complete blueprint**. Every section, every component, every API route, every database field is planned out. Tell me which **color palette** you prefer and which **phase to start with**, and I'll begin writing the actual code!
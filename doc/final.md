

# Complete Polished Portfolio - Final Production Build

> Every file below is the **final version**. Copy each file exactly as shown.

---

## FOLDER STRUCTURE (create these folders first)

```bash
mkdir -p src/app/\(public\)/projects/\[slug\]
mkdir -p src/app/admin/login
mkdir -p src/app/admin/dashboard
mkdir -p src/app/admin/projects/new
mkdir -p src/app/admin/projects/\[id\]
mkdir -p src/app/admin/experience
mkdir -p src/app/admin/skills
mkdir -p src/app/admin/testimonials
mkdir -p src/app/admin/messages
mkdir -p src/app/admin/settings
mkdir -p src/app/api/auth/\[...nextauth\]
mkdir -p src/app/api/projects/\[slug\]
mkdir -p src/app/api/experience
mkdir -p src/app/api/skills
mkdir -p src/app/api/testimonials
mkdir -p src/app/api/contact
mkdir -p src/app/api/settings
mkdir -p src/app/api/seed
mkdir -p src/app/api/admin/projects/\[id\]
mkdir -p src/app/api/admin/experience/\[id\]
mkdir -p src/app/api/admin/skills/\[id\]
mkdir -p src/app/api/admin/testimonials/\[id\]
mkdir -p src/app/api/admin/messages/\[id\]
mkdir -p src/app/api/admin/settings
mkdir -p src/app/api/admin/upload
mkdir -p src/app/api/admin/stats
mkdir -p src/components/public
mkdir -p src/components/admin
mkdir -p src/components/ui
mkdir -p src/components/animations
mkdir -p src/components/effects
mkdir -p src/lib
mkdir -p src/models
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/types
mkdir -p src/constants
mkdir -p public/images
```

---

## 1. ROOT CONFIG FILES

### `package.json`
```json
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.0.1",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.5",
    "lucide-react": "^0.344.0",
    "mongoose": "^8.1.1",
    "next": "14.1.0",
    "next-auth": "^4.24.5",
    "nodemailer": "^6.9.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.1",
    "react-hot-toast": "^2.4.1",
    "slugify": "^1.6.6",
    "tailwind-merge": "^2.2.1",
    "zod": "^3.22.4",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.11.16",
    "@types/nodemailer": "^6.4.14",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
```

### `.env.local`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

NEXTAUTH_SECRET=your-random-secret-key-at-least-32-characters-long
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_TO=your-email@gmail.com

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

### `tailwind.config.ts`
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border-color)",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: { DEFAULT: "var(--secondary)" },
        accent: { DEFAULT: "var(--accent)" },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains)"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 2. TYPES

### `src/types/index.ts`
```ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}

// Data types
export interface IProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile" | "Other";
  liveUrl?: string;
  githubUrl?: string;
  clientName?: string;
  completionDate?: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  type: "Full Time" | "Freelance" | "Contract" | "Internship";
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  techUsed: string[];
  companyLogo?: string;
  companyUrl?: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export interface ISkill {
  _id: string;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools" | "Other";
  proficiency: number;
  order: number;
  isVisible: boolean;
}

export interface ITestimonial {
  _id: string;
  clientName: string;
  clientPosition: string;
  clientImage?: string;
  content: string;
  rating: number;
  projectId?: string;
  isVisible: boolean;
  order: number;
  createdAt: string;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  repliedAt?: string;
  createdAt: string;
}

export interface ISiteSettings {
  _id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  heroImage?: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  yearsOfExperience: number;
  totalProjects: number;
  totalClients: number;
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  resumeUrl?: string;
  siteTitle: string;
  siteDescription: string;
  ogImage?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalExperience: number;
  totalSkills: number;
  totalTestimonials: number;
  totalMessages: number;
  unreadMessages: number;
  recentMessages: IMessage[];
  recentProjects: IProject[];
}
```

---

## 3. CONSTANTS

### `src/constants/index.ts`
```ts
export const PROJECT_CATEGORIES = [
  { value: "Full Stack", label: "Full Stack" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Mobile", label: "Mobile" },
  { value: "Other", label: "Other" },
];

export const EXPERIENCE_TYPES = [
  { value: "Full Time", label: "Full Time" },
  { value: "Freelance", label: "Freelance" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

export const SKILL_CATEGORIES = [
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Database", label: "Database" },
  { value: "DevOps", label: "DevOps" },
  { value: "Tools", label: "Tools" },
  { value: "Other", label: "Other" },
];

export const TECH_SUGGESTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "TypeScript", "JavaScript",
  "Node.js", "Express", "Python", "Django", "Flask", "MongoDB",
  "PostgreSQL", "MySQL", "Redis", "Docker", "AWS", "Firebase",
  "Tailwind CSS", "GraphQL", "REST API", "Prisma", "Socket.io",
  "Stripe", "Vercel", "Git", "Figma",
];

export const TECH_ICON_MAP: Record<string, string> = {
  "React": "⚛️",  "Next.js": "▲",  "TypeScript": "🟦",
  "JavaScript": "🟨",  "Node.js": "🟢",  "Python": "🐍",
  "MongoDB": "🍃",  "PostgreSQL": "🐘",  "Docker": "🐳",
  "AWS": "☁️",  "Tailwind CSS": "🎨",  "GraphQL": "🔥",
  "Redis": "🔴",  "Git": "📦",  "Figma": "🎨",  "Vue.js": "💚",
  "Angular": "🅰️",  "Express": "⚡",  "Firebase": "🔥",
  "Vercel": "▲",  "Django": "🐍",  "Flask": "🧪",
  "MySQL": "🐬",  "Prisma": "◆",  "Stripe": "💳",
  "Socket.io": "🔌",  "REST API": "🌐",
};
```

---

## 4. LIB FILES

### `src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatFullDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
}

export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
```

### `src/lib/db.ts`
```ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: Cached | undefined;
}

const cached: Cached = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) global.mongooseCache = cached;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

### `src/lib/auth.ts`
```ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) throw new Error("Invalid email or password");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### `src/lib/cloudinary.ts`
```ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: string,
  folder: string = "portfolio"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `portfolio/${folder}`,
    resource_type: "auto",
    transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
```

### `src/lib/email.ts`
```ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

export async function sendContactEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = params;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Portfolio: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6C63FF">New Contact Form Submission</h2>
        <hr style="border:1px solid #eee">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p style="background:#f5f5f5;padding:16px;border-radius:8px">${message}</p>
      </div>
    `,
  });
}
```

### `src/lib/validations.ts`
```ts
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  shortDescription: z.string().min(1, "Short description is required").max(300),
  longDescription: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).min(1, "At least one tech is required"),
  category: z.enum(["Full Stack", "Frontend", "Backend", "Mobile", "Other"]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  clientName: z.string().optional().default(""),
  completionDate: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  type: z.enum(["Full Time", "Freelance", "Contract", "Internship"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string()).optional().default([]),
  techUsed: z.array(z.string()).optional().default([]),
  companyLogo: z.string().optional().default(""),
  companyUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional().default(""),
  category: z.enum(["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"]),
  proficiency: z.number().min(0).max(100).optional().default(80),
  order: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientPosition: z.string().min(1, "Position is required"),
  clientImage: z.string().optional().default(""),
  content: z.string().min(10, "Content must be 10+ characters"),
  rating: z.number().min(1).max(5).optional().default(5),
  projectId: z.string().optional(),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be 2+ characters"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject must be 3+ characters"),
  message: z.string().min(10, "Message must be 10+ characters"),
});

export const settingsSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroDescription: z.string().min(1),
  heroCTA: z.string().optional().default("View My Work"),
  heroImage: z.string().optional().default(""),
  aboutTitle: z.string().optional().default("About Me"),
  aboutDescription: z.string().min(1),
  aboutImage: z.string().optional().default(""),
  yearsOfExperience: z.number().min(0),
  totalProjects: z.number().min(0),
  totalClients: z.number().min(0),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  github: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  resumeUrl: z.string().optional().default(""),
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  ogImage: z.string().optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
```

---

## 5. MODELS (7 files)

### `src/models/User.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin";
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
```

### `src/models/Project.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProjectDocument extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  category: string;
  liveUrl: string;
  githubUrl: string;
  clientName: string;
  completionDate: Date;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    images: [{ type: String }],
    techStack: [{ type: String }],
    category: {
      type: String,
      enum: ["Full Stack", "Frontend", "Backend", "Mobile", "Other"],
      default: "Full Stack",
    },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    clientName: { type: String, default: "" },
    completionDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ isVisible: 1, order: 1 });

export default mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);
```

### `src/models/Experience.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IExperienceDocument extends Document {
  company: string;
  position: string;
  type: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  techUsed: string[];
  companyLogo: string;
  companyUrl: string;
  order: number;
  isVisible: boolean;
}

const ExperienceSchema = new Schema<IExperienceDocument>(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full Time", "Freelance", "Contract", "Internship"],
      default: "Full Time",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    techUsed: [{ type: String }],
    companyLogo: { type: String, default: "" },
    companyUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model<IExperienceDocument>("Experience", ExperienceSchema);
```

### `src/models/Skill.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISkillDocument extends Document {
  name: string;
  icon: string;
  category: string;
  proficiency: number;
  order: number;
  isVisible: boolean;
}

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"],
      default: "Other",
    },
    proficiency: { type: Number, min: 0, max: 100, default: 80 },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model<ISkillDocument>("Skill", SkillSchema);
```

### `src/models/Testimonial.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonialDocument extends Document {
  clientName: string;
  clientPosition: string;
  clientImage: string;
  content: string;
  rating: number;
  projectId: mongoose.Types.ObjectId | null;
  isVisible: boolean;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonialDocument>(
  {
    clientName: { type: String, required: true, trim: true },
    clientPosition: { type: String, required: true, trim: true },
    clientImage: { type: String, default: "" },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonialDocument>("Testimonial", TestimonialSchema);
```

### `src/models/Message.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMessageDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  repliedAt: Date | null;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model<IMessageDocument>("Message", MessageSchema);
```

### `src/models/Settings.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISettingsDocument extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  yearsOfExperience: number;
  totalProjects: number;
  totalClients: number;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  resumeUrl: string;
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    heroTitle: { type: String, default: "Hi, I'm Developer" },
    heroSubtitle: { type: String, default: "Full Stack Developer" },
    heroDescription: { type: String, default: "I build exceptional digital experiences." },
    heroCTA: { type: String, default: "View My Work" },
    heroImage: { type: String, default: "" },
    aboutTitle: { type: String, default: "About Me" },
    aboutDescription: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    siteTitle: { type: String, default: "Portfolio" },
    siteDescription: { type: String, default: "Full Stack Developer Portfolio" },
    ogImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model<ISettingsDocument>("Settings", SettingsSchema);
```

---

## 6. STORE & HOOKS

### `src/store/adminStore.ts`
```ts
import { create } from "zustand";

interface AdminState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

### `src/hooks/useScrollSpy.ts`
```ts
"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(ids: string[], offset: number = 100) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + offset;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= pos) {
          setActive(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return active;
}
```

### `src/hooks/useMediaQuery.ts`
```ts
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

---

## 7. MIDDLEWARE (FIXED)

### `src/middleware.ts`
```ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip login page
  if (pathname === "/admin/login") return NextResponse.next();

  // Check token for admin routes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protect admin pages
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

---

## 8. GLOBALS & ROOT LAYOUT

### `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0A0A0B;
  --surface: #111113;
  --surface-2: #1A1A1F;
  --border-color: #2A2A30;
  --primary: #6C63FF;
  --primary-light: #8B83FF;
  --primary-dark: #5048CC;
  --secondary: #00D4AA;
  --accent: #FF6B6B;
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0B0;
  --text-muted: #606070;
}

[data-theme="light"] {
  --background: #FAFAFA;
  --surface: #FFFFFF;
  --surface-2: #F0F0F5;
  --border-color: #E0E0E8;
  --primary: #6C63FF;
  --primary-light: #8B83FF;
  --primary-dark: #5048CC;
  --secondary: #00B894;
  --accent: #FF6B6B;
  --text-primary: #09090B;
  --text-secondary: #52525B;
  --text-muted: #A1A1AA;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
  background-color: var(--background);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
::selection { background: rgba(108,99,255,0.3); color: var(--text-primary); }
*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: 4px; }

@layer components {
  .section-container { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }
  .section-padding { @apply py-20 md:py-28; }
  .glass-card { @apply bg-surface/80 backdrop-blur-md border border-border rounded-2xl; }
  .gradient-text { @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary; }
}

.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

input[type="range"] { -webkit-appearance: none; height: 6px; background: var(--surface-2); border-radius: 3px; outline: none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--primary); cursor: pointer; border: 3px solid var(--background); box-shadow: 0 0 0 2px var(--primary); }
```

### `src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: "Portfolio | Full Stack Developer", template: "%s | Portfolio" },
  description: "Full Stack Developer portfolio showcasing projects, experience, and skills.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            },
          }}
        />
      </body>
    </html>
  );
}
```

### `src/app/not-found.tsx`
```tsx
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors">
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
```

---

## 9. ALL UI COMPONENTS

### `src/components/ui/Button.tsx`
```tsx
"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/25",
      secondary: "bg-secondary text-white hover:opacity-90",
      outline: "border-2 border-border text-text-primary hover:border-primary hover:text-primary bg-transparent",
      ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-2 bg-transparent",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
    const sizes = { sm: "px-3 py-1.5 text-sm gap-1.5", md: "px-5 py-2.5 text-sm gap-2", lg: "px-7 py-3 text-base gap-2.5" };

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
```

### `src/components/ui/Input.tsx`
```tsx
"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">{label}</label>}
        <input ref={ref} id={inputId} className={cn(
          "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200",
          error ? "border-red-500" : "border-border hover:border-text-muted", className
        )} {...props} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-text-muted">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
```

### `src/components/ui/Textarea.tsx`
```tsx
"use client";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">{label}</label>}
        <textarea ref={ref} id={inputId} className={cn(
          "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary placeholder:text-text-muted resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200",
          error ? "border-red-500" : "border-border hover:border-text-muted", className
        )} {...props} />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export default Textarea;
```

### `src/components/ui/Select.tsx`
```tsx
"use client";
import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">{label}</label>}
        <select ref={ref} id={inputId} className={cn(
          "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer",
          error ? "border-red-500" : "border-border hover:border-text-muted", className
        )} {...props}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
export default Select;
```

### `src/components/ui/Badge.tsx`
```tsx
import { cn } from "@/lib/utils";

interface BadgeProps { children: React.ReactNode; variant?: "default"|"primary"|"secondary"|"success"|"warning"|"danger"; size?: "sm"|"md"; className?: string; }

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const v = {
    default: "bg-surface-2 text-text-secondary border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const s = { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm" };
  return <span className={cn("inline-flex items-center rounded-full border font-medium font-mono", v[variant], s[size], className)}>{children}</span>;
}
```

### `src/components/ui/Card.tsx`
```tsx
import { cn } from "@/lib/utils";

interface CardProps { children: React.ReactNode; className?: string; hover?: boolean; padding?: "none"|"sm"|"md"|"lg"; }

export default function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  const p = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div className={cn("bg-surface border border-border rounded-2xl", p[padding], hover && "hover:border-primary/30 hover:shadow-lg transition-all duration-300", className)}>
      {children}
    </div>
  );
}
```

### `src/components/ui/Modal.tsx`
```tsx
"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "sm"|"md"|"lg"|"xl"; }

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!isOpen) return null;

  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === ref.current && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={cn("relative w-full bg-surface border border-border rounded-2xl shadow-2xl animate-fade-up", sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
```

### `src/components/ui/Switch.tsx`
```tsx
"use client";
import { cn } from "@/lib/utils";

interface SwitchProps { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean; }

export default function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className={cn("inline-flex items-center gap-3 cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}>
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => !disabled && onChange(!checked)}
        className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-primary" : "bg-border")}>
        <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", checked && "translate-x-5")} />
      </button>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
}
```

### `src/components/ui/Spinner.tsx`
```tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({ size = "md", className }: { size?: "sm"|"md"|"lg"; className?: string }) {
  const s = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return <div className="flex items-center justify-center"><Loader2 className={cn("animate-spin text-primary", s[size], className)} /></div>;
}
```

### `src/components/ui/Skeleton.tsx`
```tsx
import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-surface-2 rounded-lg", className)} />;
}
```

### `src/components/ui/DeleteDialog.tsx`
```tsx
"use client";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface Props { isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string; description?: string; isLoading?: boolean; }

export default function DeleteDialog({ isOpen, onClose, onConfirm, title = "Delete Item", description = "Are you sure? This cannot be undone.", isLoading }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}
```

### `src/components/ui/ImageUploader.tsx`
```tsx
"use client";
import { useState, useCallback } from "react";
import { X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface Props { value: string; onChange: (url: string) => void; folder?: string; label?: string; className?: string; }

export default function ImageUploader({ value, onChange, folder = "general", label, className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.data.url);
      toast.success("Uploaded!");
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
    finally { setUploading(false); }
  }, [folder, onChange]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      {value ? (
        <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-border">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={() => onChange("")} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-5 h-5" /></button>
          </div>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
          className={cn("relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-text-muted")}>
          {uploading ? <Spinner size="sm" /> : (
            <>
              <div className="p-3 bg-surface-2 rounded-xl"><ImageIcon className="w-6 h-6 text-text-muted" /></div>
              <p className="text-sm text-text-secondary"><span className="text-primary font-medium">Click to upload</span> or drag</p>
              <p className="text-xs text-text-muted">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
        </div>
      )}
    </div>
  );
}
```

---

## 10. ADMIN COMPONENTS

### `src/components/admin/TagInput.tsx`
```tsx
"use client";
import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { value: string[]; onChange: (t: string[]) => void; label?: string; placeholder?: string; error?: string; suggestions?: string[]; }

export default function TagInput({ value, onChange, label, placeholder = "Type and press Enter", error, suggestions = [] }: Props) {
  const [input, setInput] = useState("");
  const [showSug, setShowSug] = useState(false);

  const add = (tag: string) => { const t = tag.trim(); if (t && !value.includes(t)) onChange([...value, t]); setInput(""); setShowSug(false); };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); if (input.trim()) add(input); }
    if (e.key === "Backspace" && !input && value.length > 0) remove(value.length - 1);
  };

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s));

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      <div className={cn("flex flex-wrap gap-2 p-3 rounded-lg border bg-surface min-h-[46px] focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all",
        error ? "border-red-500" : "border-border")}>
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-md font-mono">
            {tag}<button type="button" onClick={() => remove(i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input type="text" value={input} onChange={(e) => { setInput(e.target.value); setShowSug(true); }} onKeyDown={onKey}
            onFocus={() => setShowSug(true)} onBlur={() => setTimeout(() => setShowSug(false), 200)}
            placeholder={value.length === 0 ? placeholder : "Add more..."} className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted" />
          {showSug && input && filtered.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-surface border border-border rounded-lg shadow-xl z-10 max-h-40 overflow-y-auto">
              {filtered.map((s) => (
                <button key={s} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(s)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-surface-2 transition-colors flex items-center gap-2">
                  <Plus className="w-3 h-3 text-text-muted" />{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

### `src/components/admin/MultiImageUploader.tsx`
```tsx
"use client";
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";

interface Props { value: string[]; onChange: (urls: string[]) => void; folder?: string; label?: string; max?: number; }

export default function MultiImageUploader({ value, onChange, folder = "projects", label, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (value.length >= max) { toast.error(`Max ${max} images`); return; }
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { toast.error("Invalid file"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange([...value, data.data.url]);
      toast.success("Uploaded!");
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  }, [value, onChange, folder, max]);

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-text-secondary">{label} ({value.length}/{max})</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border">
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {value.length < max && (
          <label className={cn("relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
            uploading ? "border-primary bg-primary/5" : "border-border hover:border-text-muted")}>
            {uploading ? <Spinner size="sm" /> : <><Upload className="w-5 h-5 text-text-muted" /><span className="text-xs text-text-muted">Add Image</span></>}
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
              className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}
```

### `src/components/admin/Sidebar.tsx`
```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Briefcase, Wrench, MessageSquareQuote, Mail, Settings, LogOut, Code2, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface Props { isOpen: boolean; onClose: () => void; }

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn("fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 flex flex-col transition-transform duration-300",
        "lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"><Code2 className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-lg gradient-text">Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1"><X className="w-5 h-5 text-text-muted" /></button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-primary hover:bg-surface-2")}>
                <item.icon className="w-5 h-5 flex-shrink-0" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors">
            <Code2 className="w-5 h-5" /><span>View Site</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full">
            <LogOut className="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
```

### `src/components/admin/AdminHeader.tsx`
```tsx
"use client";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Props { title: string; subtitle?: string; onMenuClick: () => void; actions?: React.ReactNode; }

export default function AdminHeader({ title, subtitle, onMenuClick, actions }: Props) {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-surface-2 rounded-lg transition-colors"><Menu className="w-5 h-5" /></button>
          <div><h1 className="text-lg font-bold">{title}</h1>{subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}</div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">
              {session?.user?.name ? getInitials(session.user.name) : "A"}
            </div>
            <span className="hidden md:block text-sm font-medium">{session?.user?.name || "Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### `src/components/admin/StatsCard.tsx`
```tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props { title: string; value: number | string; icon: LucideIcon; color?: "primary"|"secondary"|"accent"|"info"; }

export default function StatsCard({ title, value, icon: Icon, color = "primary" }: Props) {
  const c = { primary: "bg-primary/10 text-primary", secondary: "bg-secondary/10 text-secondary", accent: "bg-accent/10 text-accent", info: "bg-blue-500/10 text-blue-400" };
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2"><p className="text-sm text-text-muted font-medium">{title}</p><p className="text-3xl font-bold">{value}</p></div>
        <div className={cn("p-3 rounded-xl", c[color])}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  );
}
```

---

## 11. ANIMATION & EFFECTS

### `src/components/animations/MotionWrapper.tsx`
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props { children: React.ReactNode; className?: string; delay?: number; direction?: "up"|"down"|"left"|"right"; }

export default function MotionWrapper({ children, className = "", delay = 0, direction = "up" }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const d = { up: { y: 40, x: 0 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 }, right: { y: 0, x: 40 } };

  return (
    <motion.div ref={ref} initial={{ opacity: 0, ...d[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...d[direction] }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}
```

### `src/components/animations/StaggerContainer.tsx`
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }: { children: React.ReactNode; className?: string; staggerDelay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }} className={className}>
      {children}
    </motion.div>
  );
}
```

### `src/components/animations/CountUp.tsx`
```tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function CountUp({ end, duration = 2000, suffix = "", prefix = "" }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    let start: number;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}
```

### `src/components/effects/GridBackground.tsx`
```tsx
"use client";
export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(var(--text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
    </div>
  );
}
```

### `src/components/ThemeProvider.tsx`
```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const ThemeContext = createContext({ theme: "dark" as Theme, toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("portfolio-theme") as Theme;
    if (saved) { setTheme(saved); document.documentElement.setAttribute("data-theme", saved); }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) return <>{children}</>;
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
```

---

## 12. ALL API ROUTES (use exact same content from Phase 2 - they're correct)

Create these files with the **exact content from Phase 2** response:

```
src/app/api/auth/[...nextauth]/route.ts
src/app/api/projects/route.ts
src/app/api/projects/[slug]/route.ts
src/app/api/experience/route.ts
src/app/api/skills/route.ts
src/app/api/testimonials/route.ts
src/app/api/settings/route.ts
src/app/api/contact/route.ts
src/app/api/seed/route.ts
src/app/api/admin/upload/route.ts
src/app/api/admin/stats/route.ts
src/app/api/admin/projects/route.ts
src/app/api/admin/projects/[id]/route.ts
src/app/api/admin/experience/route.ts
src/app/api/admin/experience/[id]/route.ts
src/app/api/admin/skills/route.ts
src/app/api/admin/skills/[id]/route.ts
src/app/api/admin/testimonials/route.ts
src/app/api/admin/testimonials/[id]/route.ts
src/app/api/admin/messages/route.ts
src/app/api/admin/messages/[id]/route.ts
src/app/api/admin/settings/route.ts
```

All API route contents remain **unchanged from Phase 1 & 2**. They are production-ready.

---

## 13. ADMIN PAGES - LAYOUT (FIXED - uses Zustand)

### `src/app/admin/layout.tsx`
```tsx
"use client";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/admin/Sidebar";
import { useAdminStore } from "@/store/adminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  if (pathname === "/admin/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="lg:ml-64 min-h-screen">{children}</main>
      </div>
    </SessionProvider>
  );
}
```

All admin pages use `useAdminStore` for menu toggle. Update each admin page's `onMenuClick`:

Replace in every admin page (`dashboard`, `projects`, `experience`, `skills`, `testimonials`, `messages`, `settings`):

```tsx
// REMOVE this import:
// import { useAdminMenu } from "@/hooks/useAdminMenu";
// const { onMenuClick } = useAdminMenu();

// USE this instead:
import { useAdminStore } from "@/store/adminStore";
// ... inside the component:
const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);
// ... in AdminHeader:
<AdminHeader title="..." onMenuClick={() => setSidebarOpen(true)} />
```

### Example fixed page - `src/app/admin/dashboard/page.tsx`
```tsx
"use client";
import { useEffect, useState } from "react";
import { FolderKanban, Briefcase, Wrench, MessageSquareQuote, Mail, MailOpen } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import { useAdminStore } from "@/store/adminStore";
import { timeAgo, truncateText } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => { if (d.success) setStats(d.data); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Overview of your portfolio" onMenuClick={() => setSidebarOpen(true)} />
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title="Projects" value={stats?.totalProjects || 0} icon={FolderKanban} color="primary" />
          <StatsCard title="Experience" value={stats?.totalExperience || 0} icon={Briefcase} color="secondary" />
          <StatsCard title="Skills" value={stats?.totalSkills || 0} icon={Wrench} color="info" />
          <StatsCard title="Testimonials" value={stats?.totalTestimonials || 0} icon={MessageSquareQuote} color="accent" />
          <StatsCard title="Messages" value={stats?.totalMessages || 0} icon={Mail} color="primary" />
          <StatsCard title="Unread" value={stats?.unreadMessages || 0} icon={MailOpen} color="accent" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
            {stats?.recentMessages?.length ? stats.recentMessages.map((m) => (
              <div key={m._id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 mb-2">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-medium truncate">{m.name}</p>{!m.isRead && <Badge variant="primary">New</Badge>}</div>
                  <p className="text-xs text-text-muted truncate">{m.subject}</p>
                  <p className="text-xs text-text-muted mt-1">{timeAgo(m.createdAt)}</p>
                </div>
              </div>
            )) : <p className="text-text-muted text-sm py-8 text-center">No messages yet</p>}
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
            {stats?.recentProjects?.length ? stats.recentProjects.map((p) => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/50 mb-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0"><FolderKanban className="w-5 h-5 text-secondary" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.title}</p><p className="text-xs text-text-muted">{truncateText(p.shortDescription, 60)}</p></div>
                <Badge variant={p.isVisible ? "success" : "warning"}>{p.isVisible ? "Live" : "Draft"}</Badge>
              </div>
            )) : <p className="text-text-muted text-sm py-8 text-center">No projects yet</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
```

**For ALL other admin pages** (`projects`, `projects/new`, `projects/[id]`, `experience`, `skills`, `testimonials`, `messages`, `settings`): 

Use the **exact content from Phase 2** but replace these two lines in each:

```tsx
// OLD (remove):
import { useAdminMenu } from "@/hooks/useAdminMenu";
const { onMenuClick } = useAdminMenu();

// NEW (add):
import { useAdminStore } from "@/store/adminStore";
const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);
```

And change `onMenuClick={onMenuClick}` to `onMenuClick={() => setSidebarOpen(true)}`.

The `src/hooks/useAdminMenu.ts` file is **no longer needed** - delete it if created.

---

## 14. ALL PUBLIC COMPONENTS

Use the **exact content from Phase 3** for all these files:

```
src/components/public/Navbar.tsx
src/components/public/Hero.tsx
src/components/public/About.tsx
src/components/public/SectionHeader.tsx
src/components/public/ProjectCard.tsx
src/components/public/ProjectsSection.tsx
src/components/public/ExperienceTimeline.tsx
src/components/public/SkillsSection.tsx
src/components/public/Testimonials.tsx
src/components/public/ContactSection.tsx
src/components/public/Footer.tsx
```

All are **unchanged** from Phase 3 - they are production-ready.

---

## 15. PUBLIC PAGES

Use **exact content from Phase 3** for:

```
src/app/(public)/layout.tsx
src/app/(public)/page.tsx
src/app/(public)/loading.tsx
src/app/(public)/projects/[slug]/page.tsx
src/app/(public)/projects/[slug]/ProjectDetailClient.tsx
```

---

## 16. SEO

### `src/app/sitemap.ts`
```ts
import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  await connectDB();
  const projects = await Project.find({ isVisible: true }).select("slug updatedAt").lean();
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt || new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
```

### `src/app/robots.ts`
```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/admin/"] }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/sitemap.xml`,
  };
}
```

---

## 17. RUN CHECKLIST

```bash
# 1. Install dependencies
npm install

# 2. Fill in .env.local with real values

# 3. Start development server
npm run dev

# 4. Seed database (browser)
# Visit: http://localhost:3000/api/seed

# 5. Login to admin
# Visit: http://localhost:3000/admin/login
# Email: your ADMIN_EMAIL from .env
# Password: your ADMIN_PASSWORD from .env

# 6. Add content via admin panel:
#    - Go to Settings → fill hero/about/social/SEO
#    - Go to Projects → add projects with images
#    - Go to Experience → add work history
#    - Go to Skills → add technologies
#    - Go to Testimonials → add client reviews

# 7. View your portfolio
# Visit: http://localhost:3000

# 8. Deploy to Vercel
npm run build
# Push to GitHub → connect to Vercel
# Add all env variables in Vercel dashboard
```

```
FINAL FILE COUNT: ~100 files
══════════════════════════════════════
Config:           5 files
Types:            1 file
Constants:        1 file
Lib:              5 files
Models:           7 files
Store:            1 file
Hooks:            2 files
Middleware:        1 file
UI Components:   12 files
Admin Components:  5 files
Animation/FX:      5 files
Public Components: 11 files
API Routes:       22 files
Admin Pages:       8 files
Public Pages:      5 files
SEO/Meta:          4 files
══════════════════════════════════════
STATUS: ✅ PRODUCTION READY
```
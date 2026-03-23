

# Phase 1: Foundation - Complete Build

## Step 1: Project Initialization

Run these commands first:

```bash
npx create-next-app@14 portfolio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd portfolio

npm install mongoose next-auth @auth/mongodb-adapter bcryptjs nodemailer cloudinary framer-motion zod react-hook-form @hookform/resolvers zustand lucide-react slugify react-hot-toast clsx tailwind-merge

npm install -D @types/bcryptjs @types/nodemailer
```

---

## Step 2: Configuration Files

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
  darkMode: "class",
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
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(108,99,255,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(108,99,255,0.4)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, var(--primary), var(--secondary))",
      },
    },
  },
  plugins: [],
};

export default config;
```

### `.env.local`
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=generate-a-random-secret-key-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_TO=your-email@gmail.com

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Step 3: Global Styles & Root Layout

### `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Dark Theme - Midnight Developer */
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

body {
  background-color: var(--background);
  color: var(--text-primary);
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Selection */
::selection {
  background: rgba(108, 99, 255, 0.3);
  color: var(--text-primary);
}

/* Focus outline */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

@layer components {
  .section-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section-padding {
    @apply py-20 md:py-28;
  }

  .glass-card {
    @apply bg-surface/80 backdrop-blur-md border border-border rounded-2xl;
  }

  .gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
  }

  .glow-border {
    box-shadow: 0 0 15px rgba(108, 99, 255, 0.15),
                inset 0 0 15px rgba(108, 99, 255, 0.05);
  }

  .text-balance {
    text-wrap: balance;
  }
}

@layer utilities {
  .animate-delay-100 {
    animation-delay: 100ms;
  }
  .animate-delay-200 {
    animation-delay: 200ms;
  }
  .animate-delay-300 {
    animation-delay: 300ms;
  }
  .animate-delay-400 {
    animation-delay: 400ms;
  }
  .animate-delay-500 {
    animation-delay: 500ms;
  }
}
```

### `src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Portfolio | Full Stack Developer",
  description:
    "Full Stack Developer portfolio showcasing projects, experience, and skills.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "react",
    "nextjs",
    "web developer",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
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
            success: {
              iconTheme: {
                primary: "#00D4AA",
                secondary: "var(--surface)",
              },
            },
            error: {
              iconTheme: {
                primary: "#FF6B6B",
                secondary: "var(--surface)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
```

### `src/app/page.tsx` (temporary home page)
```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold gradient-text">Portfolio</h1>
        <p className="text-text-secondary text-lg">
          Phase 1 Setup Complete ✅
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/admin/login"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            Admin Panel →
          </Link>
        </div>
      </div>
    </main>
  );
}
```

---

## Step 4: TypeScript Types

### `src/types/index.ts`
```ts
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

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: "admin";
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## Step 5: Utility Libraries

### `src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
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
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
```

### `src/lib/db.ts`
```ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ MongoDB connected successfully");
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

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
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
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
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
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `portfolio/${folder}`,
      resource_type: "auto",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
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
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(params: EmailParams): Promise<void> {
  const { name, email, subject, message } = params;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6C63FF;">New Contact Form Submission</h2>
      <hr style="border: 1px solid #eee;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
      <hr style="border: 1px solid #eee;">
      <p style="color: #888; font-size: 12px;">
        Sent from your portfolio contact form
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    html: htmlContent,
  });
}
```

### `src/lib/validations.ts`
```ts
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  longDescription: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
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
  company: z.string().min(1, "Company name is required"),
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
  name: z.string().min(1, "Skill name is required"),
  icon: z.string().optional().default(""),
  category: z.enum(["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"]),
  proficiency: z.number().min(0).max(100).optional().default(80),
  order: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientPosition: z.string().min(1, "Position is required"),
  clientImage: z.string().optional().default(""),
  content: z.string().min(10, "Testimonial must be at least 10 characters"),
  rating: z.number().min(1).max(5).optional().default(5),
  projectId: z.string().optional(),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
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
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

## Step 6: Mongoose Models

### `src/models/User.ts`
```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
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
  createdAt: Date;
  updatedAt: Date;
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
  {
    timestamps: true,
  }
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
  createdAt: Date;
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
  {
    timestamps: true,
  }
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
  {
    timestamps: true,
  }
);

export default mongoose.models.Skill ||
  mongoose.model<ISkillDocument>("Skill", SkillSchema);
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
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonialDocument>(
  {
    clientName: { type: String, required: true, trim: true },
    clientPosition: { type: String, required: true, trim: true },
    clientImage: { type: String, default: "" },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
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
  createdAt: Date;
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
  {
    timestamps: true,
  }
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
    heroDescription: {
      type: String,
      default: "I build exceptional digital experiences.",
    },
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
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model<ISettingsDocument>("Settings", SettingsSchema);
```

---

## Step 7: Auth API Route + Middleware

### `src/app/api/auth/[...nextauth]/route.ts`
```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### `src/middleware.ts`
```ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nexttoken;

    // Protect admin routes
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
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
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow login page always
        if (pathname.startsWith("/admin/login")) return true;

        // Allow public API routes
        if (
          pathname.startsWith("/api/") &&
          !pathname.startsWith("/api/admin")
        ) {
          return true;
        }

        // Allow public pages
        if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
          return true;
        }

        // Require auth for admin
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

---

## Step 8: Upload API Route

### `src/app/api/admin/upload/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadImage(base64, folder);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
```

---

## Step 9: Seed Script

### `src/app/api/seed/route.ts`
```ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists. Seed skipped.",
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      12
    );

    await User.create({
      email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    });

    // Create default settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        heroTitle: "Hi, I'm a Developer",
        heroSubtitle: "Full Stack Developer",
        heroDescription:
          "I build exceptional digital experiences that live on the internet. Specialized in React, Next.js, and Node.js.",
        heroCTA: "View My Work",
        aboutTitle: "About Me",
        aboutDescription:
          "I'm a passionate full-stack developer with experience building modern web applications. I love turning complex problems into simple, beautiful solutions.",
        yearsOfExperience: 0,
        totalProjects: 0,
        totalClients: 0,
        email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
        siteTitle: "Developer Portfolio",
        siteDescription:
          "Full Stack Developer portfolio showcasing projects and experience",
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Admin user and default settings created successfully!",
      credentials: {
        email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
        note: "Use the password from your .env ADMIN_PASSWORD",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
```

---

## Step 10: Base UI Components

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
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/25 hover:shadow-primary/40",
      secondary:
        "bg-secondary text-white hover:opacity-90 shadow-lg shadow-secondary/25",
      outline:
        "border-2 border-border text-text-primary hover:border-primary hover:text-primary bg-transparent",
      ghost:
        "text-text-secondary hover:text-text-primary hover:bg-surface-2 bg-transparent",
      danger:
        "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
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
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary",
            "placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200",
            error
              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
              : "border-border hover:border-text-muted",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-text-muted">{helperText}</p>
        )}
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
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary",
            "placeholder:text-text-muted resize-y min-h-[100px]",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200",
            error
              ? "border-red-500 focus:ring-red-500/50"
              : "border-border hover:border-text-muted",
            className
          )}
          {...props}
        />
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
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200 appearance-none cursor-pointer",
            error
              ? "border-red-500 focus:ring-red-500/50"
              : "border-border hover:border-text-muted",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-text-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
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

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-surface-2 text-text-secondary border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium font-mono",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
```

### `src/components/ui/Card.tsx`
```tsx
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className,
  hover = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-2xl",
        paddings[padding],
        hover &&
          "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        className
      )}
    >
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
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-surface border border-border rounded-2xl shadow-2xl animate-fade-up",
          sizes[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
```

### `src/components/ui/Skeleton.tsx`
```tsx
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-2 rounded-lg",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
```

### `src/components/ui/Switch.tsx`
```tsx
"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-text-secondary">{label}</span>
      )}
    </label>
  );
}
```

### `src/components/ui/Spinner.tsx`
```tsx
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={cn("animate-spin text-primary", sizes[size], className)}
      />
    </div>
  );
}
```

### `src/components/ui/ImageUploader.tsx`
```tsx
"use client";

import { useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "general",
  label,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        onChange(data.data.url);
        toast.success("Image uploaded!");
      } catch (error: any) {
        toast.error(error.message || "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-border">
          <Image
            src={value}
            alt="Uploaded"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200",
            "flex flex-col items-center justify-center gap-3 cursor-pointer",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-text-muted"
          )}
        >
          {isUploading ? (
            <Spinner />
          ) : (
            <>
              <div className="p-3 bg-surface-2 rounded-xl">
                <ImageIcon className="w-6 h-6 text-text-muted" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  <span className="text-primary font-medium">Click to upload</span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-text-muted mt-1">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
```

### `src/components/ui/DeleteDialog.tsx`
```tsx
"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this? This action cannot be undone.",
  isLoading = false,
}: DeleteDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## Step 11: Admin Layout Components

### `src/components/admin/Sidebar.tsx`
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Wrench,
  MessageSquareQuote,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  Code2,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: Briefcase,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-surface border-r border-border z-50",
          "flex flex-col transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          // Mobile
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg gradient-text">
                Admin
              </span>
            )}
          </Link>

          {/* Mobile close */}
          <button onClick={onClose} className="lg:hidden p-1">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border space-y-1">
          {/* Collapse button (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors w-full"
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* View Site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
          >
            <Code2 className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
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
import { Menu, Bell } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  onMenuClick,
  actions,
}: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-muted">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {actions}

          {/* Notifications */}
          <button className="relative p-2 hover:bg-surface-2 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-text-muted" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">
              {session?.user?.name ? getInitials(session.user.name) : "A"}
            </div>
            <span className="hidden md:block text-sm font-medium">
              {session?.user?.name || "Admin"}
            </span>
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

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "accent" | "info";
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
}: StatsCardProps) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    info: "bg-blue-500/10 text-blue-400",
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-text-muted font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className="text-xs text-secondary font-medium">{trend}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
```

---

## Step 12: Admin Layout + Login Page

### `src/app/admin/layout.tsx`
```tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/admin/Sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main
          className={cn(
            "transition-all duration-300 min-h-screen",
            "lg:ml-64" // sidebar width
          )}
        >
          {/* Pass the menu toggle through context or props */}
          <div className="admin-content">
            {/* We wrap children and provide the menu toggle */}
            {typeof children === "object" ? (
              <AdminContentWrapper
                onMenuClick={() => setSidebarOpen(true)}
              >
                {children}
              </AdminContentWrapper>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}

function AdminContentWrapper({
  children,
  onMenuClick,
}: {
  children: React.ReactNode;
  onMenuClick: () => void;
}) {
  // Store the menu click handler globally for child pages
  if (typeof window !== "undefined") {
    (window as any).__adminMenuClick = onMenuClick;
  }

  return <>{children}</>;
}
```

### `src/hooks/useAdminMenu.ts`
```ts
"use client";

export function useAdminMenu() {
  const onMenuClick = () => {
    if (typeof window !== "undefined" && (window as any).__adminMenuClick) {
      (window as any).__adminMenuClick();
    }
  };

  return { onMenuClick };
}
```

### `src/app/admin/login/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-text-muted mt-2">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="admin@yourdomain.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          First time?{" "}
          <a
            href="/api/seed"
            className="text-primary hover:text-primary-light transition-colors"
          >
            Run seed to create admin
          </a>
        </p>
      </div>
    </div>
  );
}
```

### `src/app/admin/dashboard/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Briefcase,
  Wrench,
  MessageSquareQuote,
  Mail,
  MailOpen,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { timeAgo, truncateText } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const { onMenuClick } = useAdminMenu();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your portfolio"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            title="Projects"
            value={stats?.totalProjects || 0}
            icon={FolderKanban}
            color="primary"
          />
          <StatsCard
            title="Experience"
            value={stats?.totalExperience || 0}
            icon={Briefcase}
            color="secondary"
          />
          <StatsCard
            title="Skills"
            value={stats?.totalSkills || 0}
            icon={Wrench}
            color="info"
          />
          <StatsCard
            title="Testimonials"
            value={stats?.totalTestimonials || 0}
            icon={MessageSquareQuote}
            color="accent"
          />
          <StatsCard
            title="Messages"
            value={stats?.totalMessages || 0}
            icon={Mail}
            color="primary"
          />
          <StatsCard
            title="Unread"
            value={stats?.unreadMessages || 0}
            icon={MailOpen}
            color="accent"
          />
        </div>

        {/* Recent Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
            {stats?.recentMessages && stats.recentMessages.length > 0 ? (
              <div className="space-y-3">
                {stats.recentMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {msg.name}
                        </p>
                        {!msg.isRead && (
                          <Badge variant="primary" size="sm">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-muted truncate">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm py-8 text-center">
                No messages yet
              </p>
            )}
          </Card>

          {/* Recent Projects */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
            {stats?.recentProjects && stats.recentProjects.length > 0 ? (
              <div className="space-y-3">
                {stats.recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors"
                  >
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-text-muted">
                        {truncateText(project.shortDescription, 60)}
                      </p>
                    </div>
                    <Badge
                      variant={project.isVisible ? "success" : "warning"}
                      size="sm"
                    >
                      {project.isVisible ? "Live" : "Draft"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm py-8 text-center">
                No projects yet. Create your first project!
              </p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
```

---

## Step 13: Dashboard Stats API

### `src/app/api/admin/stats/route.ts`
```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Testimonial from "@/models/Testimonial";
import Message from "@/models/Message";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [
      totalProjects,
      totalExperience,
      totalSkills,
      totalTestimonials,
      totalMessages,
      unreadMessages,
      recentMessages,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Testimonial.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Message.find().sort({ createdAt: -1 }).limit(5).lean(),
      Project.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalExperience,
        totalSkills,
        totalTestimonials,
        totalMessages,
        unreadMessages,
        recentMessages,
        recentProjects,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
```

---

## Step 14: Custom Hooks

### `src/hooks/useScrollSpy.ts`
```ts
"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
```

### `src/hooks/useMediaQuery.ts`
```ts
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

---

## Step 15: Zustand Store

### `src/store/adminStore.ts`
```ts
import { create } from "zustand";

interface AdminState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

---

## Step 16: Constants

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

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const TECH_ICON_MAP: Record<string, string> = {
  "React": "⚛️",
  "Next.js": "▲",
  "TypeScript": "🟦",
  "JavaScript": "🟨",
  "Node.js": "🟢",
  "Python": "🐍",
  "MongoDB": "🍃",
  "PostgreSQL": "🐘",
  "Docker": "🐳",
  "AWS": "☁️",
  "Tailwind CSS": "🎨",
  "GraphQL": "🔥",
  "Redis": "🔴",
  "Git": "📦",
  "Figma": "🎨",
  "Vue.js": "💚",
  "Angular": "🅰️",
  "Express": "⚡",
  "Firebase": "🔥",
  "Vercel": "▲",
};
```

---

## How to Run

```bash
# 1. Install dependencies (already done above)
npm install

# 2. Set up your .env.local with real values

# 3. Run the dev server
npm run dev

# 4. Seed the database (visit in browser)
# Go to: http://localhost:3000/api/seed

# 5. Login to admin
# Go to: http://localhost:3000/admin/login
# Use credentials from your .env.local
```

---

## File Count Summary

```
✅ FILES CREATED IN PHASE 1:
─────────────────────────────
Config:          4 files (next.config, tailwind, .env, tsconfig)
Styles:          1 file  (globals.css)
Layouts:         2 files (root + admin)
Lib:             6 files (db, auth, cloudinary, email, validations, utils)
Models:          7 files (User, Project, Experience, Skill, Testimonial, Message, Settings)
Types:           1 file  (index.ts)
UI Components:  12 files (Button, Input, Textarea, Select, Badge, Card, Modal, Skeleton, Switch, Spinner, ImageUploader, DeleteDialog)
Admin Comps:     3 files (Sidebar, AdminHeader, StatsCard)
Hooks:           3 files (useScrollSpy, useMediaQuery, useAdminMenu)
Store:           1 file  (adminStore)
Constants:       1 file  (index.ts)
Pages:           3 files (home, login, dashboard)
API Routes:      3 files (auth, upload, stats, seed)
Middleware:      1 file
─────────────────────────────
TOTAL:          48 files
```

```
PHASE 1 STATUS: ✅ COMPLETE
─────────────────────────────
✅ Next.js 14 + TypeScript + Tailwind
✅ MongoDB connection + 7 Mongoose models
✅ NextAuth with credentials
✅ Cloudinary image upload
✅ Email (Nodemailer) config
✅ Zod validation schemas
✅ 12 reusable UI components
✅ Admin layout with sidebar
✅ Admin login page
✅ Admin dashboard with stats
✅ Protected routes middleware
✅ Database seed script
✅ Design system (colors, fonts, animations)

NEXT → Phase 2: Admin Panel CRUD
  (Projects, Experience, Skills, 
   Testimonials, Messages, Settings)
```

Say **"Phase 2"** and I'll build the complete Admin Panel with all CRUD operations, forms, and API routes!
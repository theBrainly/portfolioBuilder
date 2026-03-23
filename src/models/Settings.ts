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

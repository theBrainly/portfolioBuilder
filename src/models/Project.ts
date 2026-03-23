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

ProjectSchema.index({ isVisible: 1, order: 1 });

export default mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);

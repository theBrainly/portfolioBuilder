import mongoose, { Schema, Document } from "mongoose";

export interface IExperienceDocument extends Document {
  userId: mongoose.Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
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

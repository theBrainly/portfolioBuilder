import mongoose, { Schema, Document } from "mongoose";

export interface ISkillDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  category: string;
  proficiency: number;
  order: number;
  isVisible: boolean;
}

const SkillSchema = new Schema<ISkillDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
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

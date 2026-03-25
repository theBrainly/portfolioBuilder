import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonialDocument extends Document {
  userId: mongoose.Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
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

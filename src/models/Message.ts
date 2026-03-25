import mongoose, { Schema, Document } from "mongoose";

export interface IMessageDocument extends Document {
  userId: mongoose.Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
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

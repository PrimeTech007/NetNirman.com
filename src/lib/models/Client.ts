import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IClient extends Document {
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  industry: string;
  source: string;
  status: "active" | "inactive";
  logoUrl: string;
  notes: string;
  gstNumber: string;
  inquiryRef: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    source: { type: String, default: "manual" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    logoUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    gstNumber: { type: String, trim: true, default: "" },
    inquiryRef: { type: Schema.Types.ObjectId, ref: "Inquiry", default: null },
  },
  { timestamps: true }
);

ClientSchema.index({ name: "text", company: "text", email: "text" });

const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;

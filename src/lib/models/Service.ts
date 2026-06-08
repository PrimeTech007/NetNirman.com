import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  icon: string;
  description: string;
  features: string[];
  order: number;
  isVisible: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ order: 1 });

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;

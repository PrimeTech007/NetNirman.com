import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  key: string;
  value: mongoose.Schema.Types.Mixed;
  description: string;
  updatedAt: Date;
  updatedBy: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;

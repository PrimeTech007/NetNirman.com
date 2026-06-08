import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITestimonial extends Document {
  clientName: string;
  company: string;
  photoUrl: string;
  quote: string;
  rating: number;
  projectRef: Types.ObjectId | null;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    photoUrl: { type: String, default: "" },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectRef: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ order: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;

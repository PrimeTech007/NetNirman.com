import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INote {
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
  source: string;
  status: "new" | "read" | "contacted" | "proposal_sent" | "won" | "lost" | "archived";
  notes: INote[];
  convertedTo: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    projectType: { type: String, required: true },
    budgetRange: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "read", "contacted", "proposal_sent", "won", "lost", "archived"],
      default: "new",
    },
    notes: [NoteSchema],
    convertedTo: { type: Schema.Types.ObjectId, ref: "Client", default: null },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ email: 1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;

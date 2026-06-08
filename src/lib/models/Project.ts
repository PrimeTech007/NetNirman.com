import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMilestone {
  _id: Types.ObjectId;
  title: string;
  dueDate: Date;
  completed: boolean;
  completedAt: Date | null;
}

export interface IProjectNote {
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface IProjectFile {
  name: string;
  url: string;
}

export interface ICaseStudy {
  problem: string;
  solution: string;
  results: string;
  images: string[];
}

export interface IProject extends Document {
  name: string;
  slug: string;
  clientId: Types.ObjectId;
  type: string[];
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  description: string;
  techStack: string[];
  startDate: Date | null;
  deadline: Date | null;
  value: number;
  paymentStatus: "pending" | "partial" | "paid";
  amountReceived: number;
  isPublic: boolean;
  isFeatured: boolean;
  thumbnailUrl: string;
  milestones: IMilestone[];
  notes: IProjectNote[];
  files: IProjectFile[];
  caseStudy: ICaseStudy;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const ProjectNoteSchema = new Schema<IProjectNote>({
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProjectFileSchema = new Schema<IProjectFile>({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const CaseStudySchema = new Schema<ICaseStudy>({
  problem: { type: String, default: "" },
  solution: { type: String, default: "" },
  results: { type: String, default: "" },
  images: [{ type: String }],
});

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    type: [{ type: String }],
    status: {
      type: String,
      enum: ["planning", "in_progress", "review", "completed", "on_hold"],
      default: "planning",
    },
    description: { type: String, default: "" },
    techStack: [{ type: String }],
    startDate: { type: Date, default: null },
    deadline: { type: Date, default: null },
    value: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    amountReceived: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    thumbnailUrl: { type: String, default: "" },
    milestones: [MilestoneSchema],
    notes: [ProjectNoteSchema],
    files: [ProjectFileSchema],
    caseStudy: { type: CaseStudySchema, default: () => ({}) },
  },
  { timestamps: true }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ clientId: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;

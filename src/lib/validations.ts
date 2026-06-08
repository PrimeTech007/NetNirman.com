import { z } from "zod";

// Public inquiry submission
export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  projectType: z.string().min(1, "Please select a project type"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  source: z.string().optional().default("website"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// Auth login
export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Client
export const clientSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional().default(""),
  email: z.email(),
  phone: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  source: z.string().optional().default("manual"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  logoUrl: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  gstNumber: z.string().optional().default(""),
});

export type ClientInput = z.infer<typeof clientSchema>;

// Project
export const projectSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  clientId: z.string().optional(),
  type: z.array(z.string()).optional().default([]),
  status: z.enum(["planning", "in_progress", "review", "completed", "on_hold"]).optional().default("planning"),
  description: z.string().optional().default(""),
  techStack: z.array(z.string()).optional().default([]),
  startDate: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  value: z.number().optional().default(0),
  paymentStatus: z.enum(["pending", "partial", "paid"]).optional().default("pending"),
  amountReceived: z.number().optional().default(0),
  isPublic: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  thumbnailUrl: z.string().optional().default(""),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// Service CMS
export const serviceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().optional().default(""),
  description: z.string().optional().default(""),
  features: z.array(z.string()).optional().default([]),
  order: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// Testimonial
export const testimonialSchema = z.object({
  clientName: z.string().min(2),
  company: z.string().optional().default(""),
  photoUrl: z.string().optional().default(""),
  quote: z.string().min(5),
  rating: z.number().min(1).max(5).optional().default(5),
  projectRef: z.string().optional().nullable(),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// User management
export const userSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8).optional(),
  role: z.enum(["super_admin", "admin", "viewer"]).optional().default("viewer"),
  isActive: z.boolean().optional().default(true),
});

export type UserInput = z.infer<typeof userSchema>;

// Note
export const noteSchema = z.object({
  content: z.string().min(1),
});

// Milestone
export const milestoneSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(),
  completed: z.boolean().optional().default(false),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;

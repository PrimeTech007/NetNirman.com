import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "viewer";
  isActive: boolean;
  lastLogin: Date;
  loginAttempts: number;
  lockUntil: Date | null;
  comparePassword(candidate: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["super_admin", "admin", "viewer"],
      default: "viewer",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const doc = this as unknown as IUser & { isModified(path: string): boolean };
  if (!doc.isModified("passwordHash")) return;
  doc.passwordHash = await bcrypt.hash(doc.passwordHash, 12);
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }
  await this.save();
};

UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  await this.save();
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

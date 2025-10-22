import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. TypeScript Interface
export interface IUser extends Document {
  email: string;
  password?: string; // Optional for safety during retrieval/token
  role: 'Buyer' | 'Agent' | 'Admin';
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  // Instance method for password comparison
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Mongoose Schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password hash by default
    },
    role: {
      type: String,
      enum: ['Buyer', 'Agent', 'Admin'],
      default: 'Buyer',
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: false },
  },
  { timestamps: true }
);

// 3. Pre-save hook: Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash if the password field is being modified or is new
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 4. Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  // This requires fetching the user with `select('+password')`
  if (!user.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
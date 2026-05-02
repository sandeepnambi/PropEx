import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// Mongoose Schema
const UserSchema = new Schema(
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
      minlength: 8,
      select: false, // Don't return password hash by default
    },
    role: {
      type: String,
      enum: ['Buyer', 'Admin', 'Tenant', 'Manager', 'Owner'],
      default: 'Buyer',
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: false },
    profilePhoto: { type: String, required: false },
    savedProperties: [{
      type: Schema.Types.ObjectId,
      ref: 'Listing'
    }],
  },
  { timestamps: true }
);

// Pre-save hook: Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash if the password field is being modified or is new
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // This requires fetching the user with `select('+password')`
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', UserSchema);

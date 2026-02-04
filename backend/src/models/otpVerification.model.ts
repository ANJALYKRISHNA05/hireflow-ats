import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpVerification extends Document {
  email: string;
  otp: string;           
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const otpVerificationSchema = new Schema<IOtpVerification>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);


otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpVerification = mongoose.model<IOtpVerification>(
  'OtpVerification',
  otpVerificationSchema
);

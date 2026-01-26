import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ApplicationStatus {
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  INTERVIEWED = 'interviewed',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export interface IApplication extends Document {
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  status: ApplicationStatus;
  resumeUrl: string;          
  coverLetterUrl?: string;   
  appliedAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate is required'],
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume is required'],
    },
    coverLetterUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
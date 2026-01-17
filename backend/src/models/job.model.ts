import mongoose, { Schema, Document, Types } from 'mongoose';


export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
}

export interface IJob extends Document {
  title: string;
  description: string;
  companyName: string;
  location: string;
  salaryRange?: string;
  jobType: JobType; 
  experience: string;
  skills: string[];
  postedBy: Types.ObjectId;
  status: 'open' | 'closed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salaryRange: {
      type: String,
      default: 'Not disclosed',
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      required: [true, 'Job type is required'],
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      minlength: [1, 'At least one skill is required'],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'paused'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);


jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ title: 'text', description: 'text' }); // basic text search

export const Job = mongoose.model<IJob>('Job', jobSchema);
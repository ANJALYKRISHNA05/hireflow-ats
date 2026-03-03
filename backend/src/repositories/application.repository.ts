import { injectable } from "inversify";
import { IApplicationRepository } from "../interfaces/repositories/application.repository.interface";
import { Application, IApplication } from "../models/application.model";
import { ApplicationStatus } from "../models/application.model";

@injectable()
export class ApplicationRepository implements IApplicationRepository {
  async create(applicationData: Partial<IApplication>): Promise<IApplication> {
    return await Application.create(applicationData);
  }

  async findById(id: string): Promise<IApplication | null> {
    // Optional: populate job here too if you ever fetch single application with full job data
    return await Application.findById(id).populate('job', 'title companyName location jobType');
  }

  async findByCandidate(userId: string): Promise<IApplication[]> {
    // ────────────────────────────────────────────────
    // THIS IS THE MOST IMPORTANT CHANGE
    // ────────────────────────────────────────────────
    return await Application.find({ candidate: userId })
      .populate('job', 'title companyName location jobType');   // ← Add this line!
  }

  async findByJob(jobId: string): Promise<IApplication[]> {
    // Also populate job + candidate info (useful for recruiter side)
    return await Application.find({ job: jobId })
      .populate('job', 'title companyName location jobType')     // job details
      .populate('candidate', 'name email');                      // candidate name & email
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    notes?: string,
  ): Promise<IApplication | null> {
    return await Application.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true },
    ).populate('job', 'title companyName location jobType');     
  }
}
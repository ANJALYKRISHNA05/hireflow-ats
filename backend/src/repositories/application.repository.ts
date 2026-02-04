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
    return await Application.findById(id);
  }

  async findByCandidate(userId: string): Promise<IApplication[]> {
    return await Application.find({ candidate: userId });
  }

  async findByJob(jobId: string): Promise<IApplication[]> {
    return await Application.find({ job: jobId });
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
    );
  }
}

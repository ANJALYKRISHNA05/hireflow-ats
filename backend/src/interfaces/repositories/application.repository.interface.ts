import { IApplication } from '../../models/application.model';
import { ApplicationStatus } from '../../models/application.model'; // ← add this line

export interface IApplicationRepository {
  create(applicationData: Partial<IApplication>): Promise<IApplication>;
  findById(id: string): Promise<IApplication | null>;
  findByCandidate(userId: string): Promise<IApplication[]>;
  findByJob(jobId: string): Promise<IApplication[]>;
  updateStatus(id: string, status: ApplicationStatus, notes?: string): Promise<IApplication | null>;
}
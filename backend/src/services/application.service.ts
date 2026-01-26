import { injectable, inject } from 'inversify';
import { IApplicationRepository } from '../interfaces/repositories/application.repository.interface';
import { IApplication, ApplicationStatus } from '../models/application.model';
import { UserRole } from '../types/roles';
import { Messages } from '../constants/messages';
import { StatusCodes } from '../constants/statusCodes';
import { Types } from 'mongoose';

@injectable()
export class ApplicationService {
  constructor(
    @inject('IApplicationRepository') private applicationRepository: IApplicationRepository
  ) {}

  async applyToJob(
    candidateId: string,
    candidateRole: UserRole,
    jobId: string,
    resumeUrl: string,
    coverLetterUrl?: string
  ): Promise<IApplication> {
  
    if (candidateRole !== UserRole.CANDIDATE) {
      throw new Error(Messages.FORBIDDEN);
    }


    const existing = await this.applicationRepository.findByCandidate(candidateId);
    if (existing.some(app => app.job.toString() === jobId)) {
      throw new Error('You have already applied to this job');
    }

    const applicationData = {
     job: new Types.ObjectId(jobId),         
    candidate: new Types.ObjectId(candidateId),
      status: ApplicationStatus.APPLIED,
      resumeUrl,
      coverLetterUrl,
    };

    return await this.applicationRepository.create(applicationData);
  }

  async getMyApplications(candidateId: string): Promise<IApplication[]> {
    return await this.applicationRepository.findByCandidate(candidateId);
  }

  async getApplicationsForJob(
    recruiterId: string,
    recruiterRole: UserRole,
    jobId: string
  ): Promise<IApplication[]> {

    const applications = await this.applicationRepository.findByJob(jobId);
   
    if (recruiterRole !== UserRole.RECRUITER && recruiterRole !== UserRole.ADMIN) {
      throw new Error(Messages.FORBIDDEN);
    }

    return applications;
  }

async updateApplicationStatus(
  recruiterId: string,
  recruiterRole: UserRole,
  applicationId: string,
  newStatus: ApplicationStatus,
  notes?: string
): Promise<IApplication> {  
  const application = await this.applicationRepository.findById(applicationId);
  if (!application) {
    throw new Error(Messages.RESOURCE_NOT_FOUND);
  }

  if (recruiterRole !== UserRole.RECRUITER && recruiterRole !== UserRole.ADMIN) {
    throw new Error(Messages.FORBIDDEN);
  }

  const updated = await this.applicationRepository.updateStatus(applicationId, newStatus, notes);
  
  if (!updated) {
    throw new Error('Failed to update application status'); 
  }

  return updated;
}
}
import { injectable, inject } from "inversify";
import { IApplicationRepository } from "../interfaces/repositories/application.repository.interface";
import { IApplication, ApplicationStatus } from "../models/application.model";
import { UserRole } from "../types/roles";
import { Messages } from "../constants/messages";
import { Types } from "mongoose";

interface ApplyToJobInput {
  userId: string;
  role: UserRole;
  jobId: string;
  files?: { [fieldname: string]: Express.Multer.File[] };
}

@injectable()
export class ApplicationService {
  constructor(
    @inject("IApplicationRepository")
    private applicationRepository: IApplicationRepository,
  ) {}

  async applyToJob(input: ApplyToJobInput): Promise<IApplication> {
    const { userId, role, jobId, files } = input;

    if (role !== UserRole.CANDIDATE) {
      throw new Error(Messages.FORBIDDEN);
    }

    const resumeFile = files?.resume?.[0];
    const coverLetterFile = files?.coverLetter?.[0];

    if (!resumeFile) {
      throw new Error("Resume file is required");
    }

    const existingApplications =
      await this.applicationRepository.findByCandidate(userId);

    if (existingApplications.some((app) => app.job.toString() === jobId)) {
      throw new Error("You have already applied to this job");
    }

    return this.applicationRepository.create({
      job: new Types.ObjectId(jobId),
      candidate: new Types.ObjectId(userId),
      status: ApplicationStatus.APPLIED,
      resumeUrl: resumeFile.path,
      coverLetterUrl: coverLetterFile?.path,
    });
  }

  async getMyApplications(candidateId: string): Promise<IApplication[]> {
    return this.applicationRepository.findByCandidate(candidateId);
  }

  async getApplicationsForJob(
    recruiterId: string,
    role: UserRole,
    jobId: string,
  ): Promise<IApplication[]> {
    if (role !== UserRole.RECRUITER && role !== UserRole.ADMIN) {
      throw new Error(Messages.FORBIDDEN);
    }

    return this.applicationRepository.findByJob(jobId);
  }

  async updateApplicationStatus(
    recruiterId: string,
    role: UserRole,
    applicationId: string,
    status: ApplicationStatus,
    notes?: string,
  ): Promise<IApplication> {
    if (role !== UserRole.RECRUITER && role !== UserRole.ADMIN) {
      throw new Error(Messages.FORBIDDEN);
    }

    const application =
      await this.applicationRepository.findById(applicationId);

    if (!application) {
      throw new Error(Messages.RESOURCE_NOT_FOUND);
    }

    const updated = await this.applicationRepository.updateStatus(
      applicationId,
      status,
      notes,
    );

    if (!updated) {
      throw new Error("Failed to update application status");
    }

    return updated;
  }
}

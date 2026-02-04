import { injectable, inject } from "inversify";
import { IJobRepository } from "../interfaces/repositories/job.repository.interface";
import { IJob } from "../models/job.model";
import { CreateJobDto, UpdateJobDto } from "../dtos/job.dto";
import { UserRole } from "../types/roles";
import { Messages } from "../constants/messages";
import { StatusCodes } from "../constants/statusCodes";
import { Types } from "mongoose";

@injectable()
export class JobService {
  constructor(
    @inject("IJobRepository") private jobRepository: IJobRepository,
  ) {}

  async createJob(
    userId: string,
    userRole: UserRole,
    dto: CreateJobDto,
  ): Promise<IJob> {
    if (![UserRole.RECRUITER, UserRole.ADMIN].includes(userRole)) {
      throw new Error(Messages.FORBIDDEN);
    }

    const jobData = {
      ...dto,
      postedBy: new Types.ObjectId(userId),
      status: dto.status || "open",
    };

    return await this.jobRepository.create(jobData);
  }

  async getJobById(id: string): Promise<IJob> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new Error(Messages.RESOURCE_NOT_FOUND);
    }
    return job;
  }

  async getMyJobs(userId: string): Promise<IJob[]> {
    return await this.jobRepository.findByPostedBy(userId);
  }

  async getAllOpenJobs(): Promise<IJob[]> {
    return await this.jobRepository.findAllOpen();
  }

  async updateJob(
    userId: string,
    userRole: UserRole,
    jobId: string,
    dto: UpdateJobDto,
  ): Promise<IJob> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new Error(Messages.RESOURCE_NOT_FOUND);
    }

    if (job.postedBy.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new Error(Messages.FORBIDDEN);
    }

    const updatedJob = await this.jobRepository.update(jobId, dto);

    if (!updatedJob) {
      throw new Error(Messages.RESOURCE_NOT_FOUND);
    }

    return updatedJob;
  }

  async deleteJob(
    userId: string,
    userRole: UserRole,
    jobId: string,
  ): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new Error(Messages.RESOURCE_NOT_FOUND);
    }

    if (job.postedBy.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new Error(Messages.FORBIDDEN);
    }

    await this.jobRepository.delete(jobId);
  }
}

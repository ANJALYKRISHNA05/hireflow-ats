import { IJob } from '../../models/job.model';

export interface IJobRepository {
  create(jobData: Partial<IJob>): Promise<IJob>;
  findById(id: string): Promise<IJob | null>;
  findByPostedBy(userId: string): Promise<IJob[]>;
  update(id: string, jobData: Partial<IJob>): Promise<IJob | null>;
  delete(id: string): Promise<void>;
  findAllOpen(): Promise<IJob[]>;
}
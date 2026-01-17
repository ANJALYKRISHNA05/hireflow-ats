import { injectable } from "inversify";
import { IJobRepository } from "../interfaces/repositories/job.repository.interface";
import {IJob,Job} from '../models/job.model'

@injectable()
export class JobRepository implements IJobRepository{
    async create(jobData:Partial<IJob>):Promise<IJob>{
        return await Job.create(jobData)
    }

    async findById(id:string):Promise<IJob|null>{
        return await Job.findById(id);
    }

    async findByPostedBy(userId:string):Promise<IJob[]>{
        return await Job.find({postedBy:userId})
    }

    async update(id:string,jobData:Partial<IJob>):Promise<IJob|null>{
        return await Job.findByIdAndUpdate(id,jobData,{new:true})
    }

    async delete(id:string):Promise<void>{
        await Job.findByIdAndDelete(id)
    }

    async findAllOpen():Promise<IJob[]>{
        return await Job.find({status:'open'})
    }
}
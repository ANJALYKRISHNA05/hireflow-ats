import { IsString, IsNotEmpty, IsEnum, IsArray, MinLength, IsOptional, IsMongoId } from 'class-validator';
import { JobType } from '../models/job.model'; 

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(50, { message: 'Description must be at least 50 characters' })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  companyName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location!: string;

  @IsString()
  @IsOptional()
  salaryRange?: string;

  @IsEnum(['Full-time', 'Part-time', 'Contract', 'Internship'], {
    message: 'Invalid job type',
  })
  jobType!: JobType;

  @IsString()
  @IsNotEmpty({ message: 'Experience is required' })
  experience!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'At least one skill is required' })
  skills!: string[];

  @IsString()
  @IsOptional()
  status?: 'open' | 'closed' | 'paused';
}

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  salaryRange?: string;

  @IsEnum(['Full-time', 'Part-time', 'Contract', 'Internship'])
  @IsOptional()
  jobType?: JobType;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  status?: 'open' | 'closed' | 'paused';
}
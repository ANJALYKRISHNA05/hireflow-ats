import { IsMongoId, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../models/application.model';

export class ApplyDto {
  @IsMongoId({ message: 'Invalid job ID' })
  jobId!: string;   
}


 
export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus, {
    message: 'Invalid application status',
  })
  status!: ApplicationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

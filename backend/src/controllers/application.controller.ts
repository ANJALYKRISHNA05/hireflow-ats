import { Request, Response } from 'express';
import { container } from '../container';
import { ApplicationService } from '../services/application.service';
import { ApplyDto, UpdateApplicationStatusDto } from '../dtos/application.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from '../constants/statusCodes';
import { Messages } from '../constants/messages';

const applicationService = container.get<ApplicationService>(ApplicationService);

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    
    const dto = plainToClass(ApplyDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors.map(err => Object.values(err.constraints || {})[0]);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const resumeFile = files?.resume?.[0];
    const coverLetterFile = files?.coverLetter?.[0];

    if (!resumeFile) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    const resumeUrl = resumeFile.path;
    const coverLetterUrl = coverLetterFile ? coverLetterFile.path : undefined;

    const application = await applicationService.applyToJob(
      user.id,
      user.role,
      dto.jobId,
      resumeUrl,
      coverLetterUrl
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error: any) {
    console.error('Apply error:', error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || Messages.SERVER_ERROR,
    });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const applications = await applicationService.getMyApplications(user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      applications,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: Messages.SERVER_ERROR,
    });
  }
};

export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { jobId } = req.params;

    const applications = await applicationService.getApplicationsForJob(user.id, user.role, jobId);

    res.status(StatusCodes.OK).json({
      success: true,
      applications,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || Messages.SERVER_ERROR,
    });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const dto = plainToClass(UpdateApplicationStatusDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => Object.values(err.constraints || {})[0]);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const updated = await applicationService.updateApplicationStatus(
      user.id,
      user.role,
      id,
      dto.status,
      dto.notes
    );

    res.status(StatusCodes.OK).json({
      success: true,
      application: updated,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || Messages.SERVER_ERROR,
    });
  }
};
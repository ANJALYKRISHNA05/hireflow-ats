import { Request, Response } from 'express';
import { container } from '../container';
import { ApplicationService } from '../services/application.service';
import { ApplyDto, UpdateApplicationStatusDto } from '../dtos/application.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from '../constants/statusCodes';
import { Messages } from '../constants/messages';
import { getErrorMessage } from '../utils/error.util';

const applicationService = container.get<ApplicationService>(ApplicationService);

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const user = req.user

    
    const dto = plainToClass(ApplyDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors.map(err => Object.values(err.constraints || {})[0]),
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const application = await applicationService.applyToJob({
      userId: user.id,
      role: user.role,
      jobId: dto.jobId,
      files,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: getErrorMessage(error)|| Messages.SERVER_ERROR,
    });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const user = (req).user;

    const applications = await applicationService.getMyApplications(user.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      applications,
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: Messages.SERVER_ERROR,
    });
  }
};

export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const user = (req).user;
    const { jobId } = req.params;

    const applications = await applicationService.getApplicationsForJob(
      user.id,
      user.role,
      jobId
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      applications,
    });
  } catch (error:unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: getErrorMessage(error)|| Messages.SERVER_ERROR,
    });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const user = (req).user;
    const { id } = req.params;

    const dto = plainToClass(UpdateApplicationStatusDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors.map(err => Object.values(err.constraints || {})[0]),
      });
    }

    const application = await applicationService.updateApplicationStatus(
      user.id,
      user.role,
      id,
      dto.status,
      dto.notes
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      application,
    });
  } catch (error:unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: getErrorMessage(error) || Messages.SERVER_ERROR,
    });
  }
};

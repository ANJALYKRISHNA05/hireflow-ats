import { Request, Response } from 'express';
import { container } from '../container';
import { JobService } from '../services/job.service';
import { CreateJobDto, UpdateJobDto } from '../dtos/job.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from '../constants/statusCodes';
import { Messages } from '../constants/messages';
import { getErrorMessage } from '../utils/error.util';

const jobService = container.get<JobService>(JobService);

export const createJob = async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(CreateJobDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => Object.values(err.constraints || {})[0]);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const user = (req).user;
    const job = await jobService.createJob(user.id, user.role, dto);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: Messages.JOB_CREATED,
      job,
    });
  } catch (error:unknown) {
    
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message:getErrorMessage(error)|| Messages.SERVER_ERROR,
    });
  }
};

export const getAllOpenJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await jobService.getAllOpenJobs();
    res.status(StatusCodes.OK).json({
      success: true,
      jobs,
    });
  } catch (error:unknown) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      job,
    });
  } catch (error:unknown) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: getErrorMessage(error) || Messages.RESOURCE_NOT_FOUND,
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dto = plainToClass(UpdateJobDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => Object.values(err.constraints || {})[0]);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const user = (req).user;
    const updatedJob = await jobService.updateJob(user.id, user.role, id, dto);

    res.status(StatusCodes.OK).json({
      success: true,
      job: updatedJob,
    });
  } catch (error:unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: getErrorMessage(error) || Messages.SERVER_ERROR,
    });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req).user;
    await jobService.deleteJob(user.id, user.role, id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error:unknown) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message:getErrorMessage(error) || Messages.SERVER_ERROR,
    });
  }
};

export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const user = (req).user;
    const jobs = await jobService.getMyJobs(user.id);
    res.status(StatusCodes.OK).json({
      success: true,
      jobs,
    });
  } catch (error:unknown) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: Messages.SERVER_ERROR,
    });
  }
};
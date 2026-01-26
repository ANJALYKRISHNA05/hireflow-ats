import { Request, Response } from 'express';
import { container } from '../container';
import { AuthService } from '../services/auth.service';
import { StatusCodes } from '../constants/statusCodes';
import { Messages } from '../constants/messages';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from '../types/roles';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const authService = container.get<AuthService>(AuthService);

export const register = async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(RegisterDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => err.constraints?.[Object.keys(err.constraints)[0]]);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const result = await authService.register(
      dto.name,
      dto.email,
      dto.password,
      dto.role || UserRole.CANDIDATE
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: Messages.REGISTER_SUCCESS,
      accessToken: result.token,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || Messages.SERVER_ERROR,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(LoginDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => err.constraints?.[Object.keys(err.constraints)[0]]);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
const result = await authService.login(dto.email, dto.password);

    res.status(StatusCodes.OK).json({
      success: true,
      message: Messages.LOGIN_SUCCESS,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || Messages.INVALID_CREDENTIALS,
    });
  }
};


export const logout=async(req:Request,res:Response)=>{
  try{
    const userId=(req as any).user.id;
    await authService.logout(userId);
    res.status(StatusCodes.OK).json({
      success:true,
      message:'Logged out successfully.Refresh token invalidated'
    })
  }catch(error:any){
    console.error('Logout error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Logout failed'
    });
  }
  }


  export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const result = await authService.refresh(refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || 'Invalid refresh token',
    });
  }
};

import { Request, Response } from "express";
import { container } from "../container";
import { User } from "../models/user.model";
import { OtpService } from "../services/otp.service";
import { EmailService } from "../services/email.service";
import { AuthService } from "../services/auth.service";
import { StatusCodes } from "../constants/statusCodes";
import { Messages } from "../constants/messages";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { UserRole } from "../types/roles";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { getErrorMessage } from "../utils/error.util";

const authService = container.get<AuthService>(AuthService);
const otpService = new OtpService();
const emailService = new EmailService();

export const requestRegisterOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email is required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = await otpService.createOtp(email);
    await emailService.sendOtpEmail(email, otp);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error: unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(RegisterDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(
        (err) => err.constraints?.[Object.keys(err.constraints)[0]]
      );

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

   
    await otpService.verifyOtp(dto.email, dto.otp);

    const result = await authService.register(
      dto.name,
      dto.email,
      dto.password,
      dto.role || UserRole.CANDIDATE
    );

return res.status(StatusCodes.CREATED).json({
  success: true,
  message: Messages.REGISTER_SUCCESS,
  accessToken: result.accessToken,
  refreshToken: result.refreshToken,
  user: {
    id: result.user._id.toString(),
    name: result.user.name,
    email: result.user.email,
    role: result.user.role.toLowerCase(),  
  },
});
  } catch (error: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(LoginDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map(
        (err) => err.constraints?.[Object.keys(err.constraints)[0]]
      );

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    const result = await authService.login(dto.email, dto.password);

return res.status(StatusCodes.OK).json({
  success: true,
  message: Messages.LOGIN_SUCCESS,
  accessToken: result.accessToken,
  refreshToken: result.refreshToken,
  user: {
    id: result.user._id.toString(),
    name: result.user.name,
    email: result.user.email,
    role: result.user.role.toLowerCase(),   
  },
});
  } catch (error: unknown) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: getErrorMessage(error) || Messages.INVALID_CREDENTIALS,
    });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req

      
    ).user.id;
    await authService.logout(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully.Refresh token invalidated",
    });
  } catch (error: unknown) {
    console.error("Logout error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:getErrorMessage(error),
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:getErrorMessage(Error),
      });
    }

    const result = await authService.refresh(refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error:unknown) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message:getErrorMessage(error) || "Invalid refresh token",
    });
  }
};




export const requestPasswordResetOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email is required",
      });
    }

    await authService.requestPasswordResetOtp(email);

   
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "If your email is registered, you will receive an OTP shortly.",
    });
  } catch (error: unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getErrorMessage(error) || Messages.SERVER_ERROR,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }


    await authService.resetPasswordWithOtp(email, otp, newPassword);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password has been reset successfully. Please login.",
    });
  } catch (error: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: getErrorMessage(error) || "Invalid or expired OTP",
    });
  }
};

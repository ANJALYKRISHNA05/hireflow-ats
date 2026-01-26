import {injectable,inject} from 'inversify'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import bcrypt from 'bcryptjs'
import {generateAccessToken} from '../utils/jwt';
import { generateRefreshToken } from '../utils/jwt';
import {StatusCodes} from '../constants/statusCodes'
import {Messages} from '../constants/messages';
import jwt from 'jsonwebtoken'
import {UserRole} from '../types/roles';
import { RefreshToken } from '../models/refreshToken.model';

@injectable()
export class AuthService{
    constructor(
        @inject('IUserRepository')
        private userRepository:IUserRepository)
        {}

        async register(name:string,email:string,password:string,role:UserRole){
            const existingUser=await this.userRepository.findByEmail(email)
            if(existingUser){
                throw new Error(Messages.EMAIL_ALREADY_EXISTS)
            }
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt);
            const user=await this.userRepository.create({
                name,
                email,
                password:hashedPassword,
                role:role||UserRole.CANDIDATE,

            })
            const token=generateAccessToken({userId:user._id.toString(),role:user.role});
            return {user,token}
        }



async login(email: string, password: string) {
  const user = await this.userRepository.findByEmail(email);
  if (!user) throw new Error(Messages.INVALID_CREDENTIALS);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error(Messages.INVALID_CREDENTIALS);

  const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });

 
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return { user, accessToken, refreshToken };
}

async logout(userId:string){
            await RefreshToken.deleteMany({user:userId})
            return {message:'Logged out successfully'}
        }


async refresh(refreshToken: string) {
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET!
  ) as { userId: string };

  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    user: decoded.userId,
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  await RefreshToken.deleteOne({ _id: storedToken._id });

  const newRefreshToken = generateRefreshToken({ userId: decoded.userId });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    token: newRefreshToken,
    user: decoded.userId,
    expiresAt,
  });

  const user = await this.userRepository.findById(decoded.userId);
  if (!user) throw new Error(Messages.USER_NOT_FOUND);

  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}




    
}

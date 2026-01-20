import {injectable,inject} from 'inversify'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import bcrypt from 'bcryptjs'
import {generateAccessToken} from '../utils/jwt';
import { generateRefreshToken } from '../utils/jwt';
import {StatusCodes} from '../constants/statusCodes'
import {Messages} from '../constants/messages';
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


        async login(email:string,password:string){
            const user=await this.userRepository.findByEmail(email)
            if(!user){
                throw new Error(Messages.INVALID_CREDENTIALS)
            }
            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                throw new Error(Messages.INVALID_CREDENTIALS)
            }
            const token=generateAccessToken({userId:user._id.toString(),role:user.role})
            return {user,token}
        }

        async logout(userId:string){
            await RefreshToken.deleteMany({user:userId})
            return {message:'Logged out successfully'}
        }



    
}

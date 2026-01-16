import {Request,Response} from 'express'
import {container} from '../container'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import {StatusCodes} from '../constants/statusCodes';

export const getCurrentUser=async(req:Request,res:Response)=>{
    try{

        const userRepo=container.get<IUserRepository>('IUserRepository');
        const userId=(req as any).user.id;
        

        const user=await userRepo.findById(userId)
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({
                success:false,
                message:'User not found'
            })
        }
        const {password,...safeUser}=user.toObject()
        return res.status(StatusCodes.OK).json({
            success:true,
            user:safeUser
        })

    }catch(error){
        console.error('Get current user error',error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:'Server error'
        })
    }
}
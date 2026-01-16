import {Request,Response} from 'express'
import {container} from '../container'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import {StatusCodes} from '../constants/statusCodes';
import {Messages} from '../constants/messages'
import { UserService } from '../services/user.service';
export const getCurrentUser=async(req:Request,res:Response)=>{
    try{

        
        const userId=(req as any).user.id;
        const userService=container.get<UserService>('UserService')
        const user=await userService.getCurrentUser(userId)
        return res.status(StatusCodes.OK).json({
            success:true,
            user
        })

       

    }catch(error:any){
        console.error('Get current user error',error)
        if(error.message===Messages.USER_NOT_FOUND){
            return res.status(StatusCodes.NOT_FOUND).json({
                success:false,
                message:error.message
            })
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:Messages.SERVER_ERROR
        })
        
        
    }
}
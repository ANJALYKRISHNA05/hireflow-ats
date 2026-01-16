import {Request,Response,NextFunction} from 'express'
import {UserRole} from '../types/roles'
import { StatusCodes } from '../constants/statusCodes'
import {Messages} from '../constants/messages'

export const authorize=(...allowedRoles:UserRole[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const user=(req as any).user;
        console.log(user)
        if(!user?.role||!allowedRoles.includes(user.role as UserRole)){
            res.status(StatusCodes.FORBIDDEN).json({
                success:false,
                message:Messages.FORBIDDEN||'INSUFFICIENT PERMISSION'
            })
        }
        next()
    }

}
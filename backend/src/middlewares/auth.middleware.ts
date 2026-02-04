import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { StatusCodes } from '../constants/statusCodes'
import { Messages } from '../constants/messages'
import dotenv from 'dotenv'

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET!;
export const authenticate=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader||!authHeader.startsWith('Bearer ')){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success:false,
            message:Messages.UNAUTHORIZED||'No token provided'
        })
    }
    const token=authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {
  userId: string;
  role: string;
};
    
(req as any).user = {
  id: decoded.userId,
  role: decoded.role
};

next()

}catch(error){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success:false,
            message:'Invalid or expired token'
        })

    }
}

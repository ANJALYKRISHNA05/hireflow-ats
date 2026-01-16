import { injectable,inject } from "inversify";
import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import {Messages} from '../constants/messages'

@injectable()
export class UserService{
    constructor(@inject('IUserRepository')
    private userRepository:IUserRepository
){}

async getCurrentUser(userId:string){
    const user=await this.userRepository.findById(userId)
    if(!user){
        throw new Error(Messages.USER_NOT_FOUND)
    }
    const {password, ...safeUser}=user.toObject()
    return safeUser
}
}
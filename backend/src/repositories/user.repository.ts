import {injectable} from 'inversify';
import {IUserRepository} from '../interfaces/repositories/user.repository.interface'
import {IUser, User} from '../models/user.model'

@injectable()
export class UserRepository implements IUserRepository{
  async findByEmail(email:string):Promise<any|null>{
    return await User.findOne({email})
  }

  async findById(id:string):Promise<any|null>{
    return await User.findById(id)
  }

  async create(userData:Partial<any>):Promise<any>{
    return await User.create(userData)
  }
}
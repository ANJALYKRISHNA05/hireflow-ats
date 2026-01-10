import {Container} from 'inversify';
import 'reflect-metadata';
import { IUserRepository } from './interfaces/repositories/user.repository.interface';
import { UserRepository } from './repositories/user.repository';


const container=new Container();
container.bind<IUserRepository>('IUserRepository').to(UserRepository);


export {container}
import { Container } from 'inversify';
import 'reflect-metadata';
import { IUserRepository } from './interfaces/repositories/user.repository.interface';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service'; 
import { UserService } from './services/user.service'

const container = new Container();

container.bind<IUserRepository>('IUserRepository').to(UserRepository);
container.bind<AuthService>(AuthService).toSelf();
container.bind<UserService>('UserService').to(UserService)

export { container };
import { Container } from 'inversify';
import 'reflect-metadata';
import { IUserRepository } from './interfaces/repositories/user.repository.interface';
import { UserRepository } from './repositories/user.repository';
import { IJobRepository } from './interfaces/repositories/job.repository.interface';
import { JobRepository } from './repositories/job.repository';
import { IApplicationRepository } from './interfaces/repositories/application.repository.interface';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationService } from './services/application.service'
import { JobService } from './services/job.service'
import { AuthService } from './services/auth.service'; 
import { UserService } from './services/user.service'
const container = new Container();

//repository
container.bind<IUserRepository>('IUserRepository').to(UserRepository);
container.bind<IJobRepository>('IJobRepository').to(JobRepository);
container.bind<IApplicationRepository>('IApplicationRepository').to(ApplicationRepository);

//service
container.bind<AuthService>(AuthService).toSelf();
container.bind<UserService>('UserService').to(UserService)
container.bind<JobService>(JobService).toSelf();
container.bind<ApplicationService>(ApplicationService).toSelf();

export { container };
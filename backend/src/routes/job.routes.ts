import { Router } from 'express';
import { createJob, getAllOpenJobs,getJobById,updateJob,deleteJob,getMyJobs,} from '../controllers/job.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { UserRole } from '../types/roles';

const router = Router();
router.get('/', getAllOpenJobs);
router.post('/', authenticate, authorize(UserRole.RECRUITER), createJob);
router.get('/my', authenticate, authorize(UserRole.RECRUITER), getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', authenticate, authorize(UserRole.RECRUITER), updateJob);
router.delete('/:id', authenticate, authorize(UserRole.RECRUITER), deleteJob);

export default router;
import {Router} from 'express'
import { getCurrentUser } from '../controllers/user.controller'
import { authenticate } from '../middlewares/auth.middleware'
const router=Router();
router.get('/current',authenticate,getCurrentUser)
export default router;
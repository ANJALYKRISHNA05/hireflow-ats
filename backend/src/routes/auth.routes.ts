import {Router} from 'express'
import {login,logout,refresh, requestRegisterOtp,register} from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware';
const router=Router()

router.post('/login',login)
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh); 
router.post("/register/request-otp", requestRegisterOtp);
router.post("/register", register);
export default router
import crypto from 'crypto';
import bcrypt from 'bcryptjs'
import { OtpVerification } from '../models/otpVerification.model';
const OTP_LENGTH=6;
const OTP_EXPIRY_MINUTES=5;
const MAX_ATTEMPTS=20
export class OtpService{
    generateOtp():string{
        return crypto.randomInt(0,Math.pow(10,OTP_LENGTH)).toString().padStart(OTP_LENGTH,'0');

    }

    async createOtp(email:string):Promise<string>{
        await OtpVerification.deleteOne({email})
        const otp=this.generateOtp();
        const hashedOtp=await bcrypt.hash(otp,10);
        const expiresAt=new Date(Date.now()+OTP_EXPIRY_MINUTES*60*1000)
        await OtpVerification.create({
            email,otp:hashedOtp,expiresAt,
        })
        return otp;
    }

    async verifyOtp(email:string,otp:string):Promise<void>{
        const record=await OtpVerification.findOne({email});
        if(!record){
            throw new Error('OTP not found or expired')
        }

          if (record.attempts >= MAX_ATTEMPTS) {
    await OtpVerification.deleteOne({ email });
    throw new Error("Too many invalid attempts. Request new OTP.");
  } 
        if(record.expiresAt.getTime()<Date.now()){
            await OtpVerification.deleteOne({email});
            throw new Error('OTP expired')
        }
        const isValid=await bcrypt.compare(otp,record.otp)
        if(!isValid){
            record.attempts+=1;
            await record.save();
            throw new Error('Invalid OTP');
        }
        await OtpVerification.deleteOne({email})
        

    }
}
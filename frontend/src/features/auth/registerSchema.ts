import * as Yup from 'yup';

export const registerSchema = Yup.object({
  name: Yup.string().min(2).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  role: Yup.string().oneOf(['candidate', 'recruiter']).required(),
});

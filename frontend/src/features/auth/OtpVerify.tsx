import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { loginSuccess } from './authSlice';
import type { RootState } from '../../store';

interface VerifyOtpFormData {
  otp: string;
}

const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('OTP is required'),
});

export default function VerifyOtp() {
  const navigate = useNavigate();
 
  const dispatch = useDispatch();

  const { otpPurpose } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
const email = (location.state as any)?.email;


  // Safety guard: no email or no OTP purpose → restart auth flow
if (!email) {
  navigate("/login");
  return null;
}


  const initialValues: VerifyOtpFormData = { otp: '' };

  const onSubmit = async (
    values: VerifyOtpFormData,
    { setSubmitting }: any
  ) => {
    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp: values.otp,
      });

      // LOGIN OTP → complete login
      if (otpPurpose === 'login') {
        dispatch(loginSuccess(res.data));
        navigate('/dashboard');
        return;
      }

      // REGISTER OTP → just verify email
      toast.success('Email verified! You can now login.');
      navigate('/login');
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'OTP verification failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify OTP
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={otpSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  OTP
                </label>
                <Field
                  name="otp"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter 6-digit OTP"
                />
                <ErrorMessage
                  name="otp"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-60"
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

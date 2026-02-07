import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { loginSuccess } from './authSlice';
import toast from 'react-hot-toast';

const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
});

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  if (!state?.email || !state?.password || !state?.name) {
    navigate('/register');
    return null;
  }

  const { email, name, password, role } = state;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100/50">
      
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-3 text-gray-600">
            We sent a 6-digit code to
          </p>
          <p className="mt-1 font-medium text-gray-900">{email}</p>
        </div>


        <Formik
          initialValues={{ otp: '' }}
          validationSchema={otpSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await api.post('/auth/register', {
                name,
                email,
                password,
                role,
                otp: values.otp,
              });

              dispatch(loginSuccess(res.data));
              toast.success('Account created successfully!');
              navigate('/dashboard');
            } catch (err: any) {
              const message =
                err.response?.data?.message ||
                'Invalid or expired OTP. Please try again.';
              toast.error(message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP
                </label>
                <Field
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className={`w-full text-center text-3xl tracking-[10px] font-mono border border-gray-300 rounded-lg py-5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                    isSubmitting ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
                <ErrorMessage
                  name="otp"
                  component="p"
                  className="mt-2 text-sm text-red-600 text-center font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </Form>
          )}
        </Formik>

        
        <p className="mt-8 text-center text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={() =>
              toast('Resend coming soon – please check spam folder')
            }
            className="text-indigo-600 hover:underline font-medium"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}

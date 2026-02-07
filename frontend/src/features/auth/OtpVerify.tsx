import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { loginSuccess } from './authSlice';
import toast from 'react-hot-toast';

const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('OTP is required'),
});

export default function OtpVerify() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const state = location.state as {
    email: string;
    name: string;
    password: string;
    role: 'candidate' | 'recruiter';
  } | null;

  if (!state) {
    navigate('/register');
    return null;
  }

  const { email, name, password, role } = state;

  const [timeLeft, setTimeLeft] = useState(60);
  const [expired, setExpired] = useState(false);
  const [resending, setResending] = useState(false);

  // ⏱️ Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🔁 Resend OTP
  const resendOtp = async () => {
    try {
      setResending(true);

      await api.post('/auth/register/request-otp', { email });

      toast.success('OTP resent successfully');
      setTimeLeft(60);
      setExpired(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
        </p>

        <Formik
          initialValues={{ otp: '' }}
          validationSchema={otpSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (expired) return;

            try {
              const res = await api.post('/auth/register', {
                name,
                email,
                password,
                role,
                otp: values.otp,
              });

              dispatch(
                loginSuccess({
                  accessToken: res.data.accessToken,
                  user: res.data.user,
                })
              );

              toast.success('Account created successfully');
              navigate('/dashboard');
            } catch (err: any) {
              toast.error(err.response?.data?.message || 'Invalid OTP');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="otp"
                  placeholder="Enter OTP"
                  disabled={expired}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    expired
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'focus:ring-blue-500'
                  }`}
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {!expired ? (
                <p className="text-sm text-gray-600 text-center">
                  OTP expires in{' '}
                  <span className="font-semibold text-blue-600">
                    {timeLeft}s
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-500 text-center">
                  OTP expired. Please resend.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || expired}
                className={`w-full py-2 rounded-lg font-medium transition ${
                  expired
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Verify OTP
              </button>
            </Form>
          )}
        </Formik>

        {expired && (
          <button
            onClick={resendOtp}
            disabled={resending}
            className="mt-4 w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
}

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import { loginSuccess } from './authSlice';

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6).required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    try {
      const res = await api.post('/auth/login', values);
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to continue your journey
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white/70"
                  placeholder="you@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1.5 text-sm text-red-600 font-medium"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white/70"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1.5 text-sm text-red-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                  Create one now →
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
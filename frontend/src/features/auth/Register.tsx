import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import toast from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'candidate' | 'recruiter' | '';
}

const registerSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['candidate', 'recruiter'], 'Select a valid role').required('Role is required'),
});

export default function Register() {
  const navigate = useNavigate();

  const initialValues: RegisterFormData = {
    name: '',
    email: '',
    password: '',
    role: '',
  };

  const onSubmit = async (values: RegisterFormData, { setSubmitting }: any) => {
    try {
      await api.post('/auth/register', values);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Registration failed. Try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Join HireFlow
          </h2>
          <p className="mt-2 text-gray-600">
            Create your account and start today
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <Field
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 bg-white/70"
                  placeholder="John Doe"
                />
                <ErrorMessage name="name" component="p" className="mt-1.5 text-sm text-red-600 font-medium" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 bg-white/70"
                  placeholder="you@example.com"
                />
                <ErrorMessage name="email" component="p" className="mt-1.5 text-sm text-red-600 font-medium" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 bg-white/70"
                  placeholder="••••••••"
                />
                <ErrorMessage name="password" component="p" className="mt-1.5 text-sm text-red-600 font-medium" />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                  I want to
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 bg-white/70 appearance-none"
                >
                  <option value="">Select your role</option>
                  <option value="candidate">I'm looking for a job (Candidate)</option>
                  <option value="recruiter">I'm hiring talent (Recruiter)</option>
                </Field>
                <ErrorMessage name="role" component="p" className="mt-1.5 text-sm text-red-600 font-medium" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-purple-600 hover:text-purple-800 transition-colors">
                  Sign in →
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
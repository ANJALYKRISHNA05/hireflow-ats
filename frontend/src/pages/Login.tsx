import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from '../api/api'
import { loginSuccess } from '../features/auth/authSlice'

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: LoginFormData = {
    email: "",
    password: "",
  };

  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    try {
      const res = await api.post("/auth/login", values);
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field name="email" className="input" placeholder="Email" />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  className="input"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center">
                No account?{" "}
                <Link to="/register" className="text-blue-600">
                  Register
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

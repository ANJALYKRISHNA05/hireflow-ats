import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import { loginSuccess } from "./authSlice";
import toast from "react-hot-toast";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to continue</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await api.post("/auth/login", values);

              dispatch(
                loginSuccess({
                  accessToken: res.data.accessToken,
                  user: res.data.user,
                })
              );

              toast.success("Login successful!");
              navigate("/dashboard");
            } catch (err: any) {
              toast.error(
                err.response?.data?.message || "Login failed"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

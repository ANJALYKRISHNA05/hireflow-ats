import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter" | "";
}

const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["candidate", "recruiter"], "Select a valid role")
    .required("Role is required"),
});

export default function Register() {
  const navigate = useNavigate();

  const initialValues: RegisterFormData = {
    name: "",
    email: "",
    password: "",
    role: "",
  };

  const onSubmit = async (
    values: RegisterFormData,
    { setSubmitting }: any
  ) => {
    try {
      await api.post("/auth/register/request-otp", {
        email: values.email,
      });

      toast.success("OTP sent to your email!");

      navigate("/verify-otp", {
        state: {
          email: values.email,
          name: values.name,
          password: values.password,
          role: values.role,
        },
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Field
                  name="name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="you@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  I want to
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select your role</option>
                  <option value="candidate">
                    I'm looking for a job
                  </option>
                  <option value="recruiter">
                    I'm hiring talent
                  </option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
              >
                {isSubmitting ? "Sending OTP..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

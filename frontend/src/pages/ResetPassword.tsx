import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api/api'
import toast from "react-hot-toast";

const resetSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();

  
  if (!state?.email) {
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-gray-600">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium">{state.email}</span>
          </p>
        </div>

        <Formik
          initialValues={{
            otp: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={resetSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.post("/auth/reset-password", {
                email: state.email,
                otp: values.otp,
                newPassword: values.newPassword,
              });

              toast.success("Password reset successful! Please log in.");
              navigate("/login");
            } catch (err: any) {
              toast.error(
                err.response?.data?.message || "Invalid or expired code"
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
                  name="otp"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full text-center text-2xl tracking-[10px] font-mono border border-gray-300 rounded-lg py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ErrorMessage
                  name="otp"
                  component="p"
                  className="mt-1 text-sm text-red-600 text-center"
                />
              </div>

              <div>
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ErrorMessage
                  name="newPassword"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg text-white font-medium transition ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-600">
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
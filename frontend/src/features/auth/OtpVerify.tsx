import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../api/api";
import { loginSuccess } from "./authSlice";
import toast from "react-hot-toast";

const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

export default function VerifyOtp() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!state) {
    navigate("/register");
    return null;
  }

  const { email } = state;

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
          <p className="mt-1 font-medium text-gray-900">
            {email}
          </p>
        </div>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await api.post("/auth/register", {
                ...state,
                otp: values.otp,
              });

              dispatch(
                loginSuccess({
                  accessToken: res.data.accessToken,
                  user: res.data.user,
                })
              );

              toast.success("Account created successfully!");
              navigate("/dashboard");
            } catch (err: any) {
              toast.error(
                err.response?.data?.message ||
                  "Invalid or expired OTP"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <Field
                  name="otp"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full text-center text-3xl tracking-[10px] font-mono border border-gray-300 rounded-lg py-5 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ErrorMessage
                  name="otp"
                  component="p"
                  className="mt-2 text-sm text-red-600 text-center"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

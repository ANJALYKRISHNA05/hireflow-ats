import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Welcome back, {user.name}
                  </h1>
                  <p className="mt-2 text-indigo-100">
                    You're signed in as{" "}
                    <span className="font-semibold">
                      {user.role}
                    </span>
                  </p>
                </div>

                <div className="hidden sm:block">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border">
                  <h3 className="text-lg font-semibold">
                    Account Type
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-indigo-600 capitalize">
                    {user.role}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border">
                  <h3 className="text-lg font-semibold">
                    Email
                  </h3>
                  <p className="mt-2 text-lg break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg shadow-lg hover:shadow-xl transition"
              >
                Sign Out
              </button>
            </div>

            <div className="px-8 py-4 bg-gray-50 text-center text-sm text-gray-500">
              {new Date().getFullYear()} • Hireflow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

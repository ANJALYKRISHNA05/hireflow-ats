import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayName = user?.name || user?.email.split("@")[0] || "User";
  const avatarLetter = displayName[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Welcome back, {displayName}
              </h1>
              <p className="mt-3 text-indigo-100/90 text-lg">
                You're signed in as{" "}
                <span className="font-semibold capitalize">{user?.role}</span>
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl font-semibold shadow-lg border-2 border-white/30">
                {avatarLetter}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 transition-all hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Account Type
              </h3>
              <p className="text-2xl font-bold text-indigo-600 capitalize">
                {user?.role}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 transition-all hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Email Address
              </h3>
              <p className="text-lg text-slate-800 break-all">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <UserCircle size={20} />
              View Profile
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Browse Jobs
            </button>

            <button
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-6 text-center text-sm text-slate-500 border-t border-slate-200">
        <div className="container mx-auto px-6">
          © {new Date().getFullYear()} HireFlow • All rights reserved
        </div>
      </footer>
    </div>
  );
}

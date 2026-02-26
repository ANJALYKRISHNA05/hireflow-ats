import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, Briefcase, FileText, User } from "lucide-react";
import toast from "react-hot-toast";

export default function CandidateDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header - Elegant & Subtle */}
      <header className="bg-gradient-to-br from-indigo-800 via-indigo-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "Candidate"}
              </h1>
              <p className="mt-2 text-indigo-200/80 text-base font-light">
                Find opportunities that match your skills and goals
              </p>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-semibold border border-white/20 shadow-inner">
              {user?.name?.[0]?.toUpperCase() || "C"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-12">
        <h2 className="text-xl md:text-2xl font-medium text-slate-800 mb-8 text-center md:text-left">
          Quick Actions
        </h2>

        {/* 4-Card Grid - Elegant & Minimal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Browse Jobs */}
          <div
            onClick={() => navigate("/jobs")}
            className="group bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 hover:shadow-md hover:border-indigo-200/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50/70 rounded-lg group-hover:bg-indigo-100/70 transition-colors">
                <Briefcase className="w-7 h-7 text-indigo-700" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">Browse Jobs</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Discover open roles tailored to your experience
            </p>
          </div>

          {/* My Applications */}
          <div
            onClick={() => navigate("/my-applications")}
            className="group bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 hover:shadow-md hover:border-blue-200/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50/70 rounded-lg group-hover:bg-blue-100/70 transition-colors">
                <FileText className="w-7 h-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">My Applications</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track progress and status of your applications
            </p>
          </div>

          {/* My Profile */}
          <div
            onClick={() => navigate("/profile")}
            className="group bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 hover:shadow-md hover:border-green-200/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-50/70 rounded-lg group-hover:bg-green-100/70 transition-colors">
                <User className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">My Profile</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Manage your information and preferences
            </p>
          </div>

          {/* Saved Jobs - Coming Soon */}
          <div className="bg-slate-50/60 rounded-xl shadow-sm border border-slate-200/70 p-6 opacity-80">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100/70 rounded-lg">
                <svg
                  className="w-7 h-7 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700">Saved Jobs</h3>
            </div>
            <p className="text-slate-500 text-sm">Feature coming soon</p>
          </div>
        </div>

        {/* Logout - Elegant dark style */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              toast.success("Logged out successfully", { duration: 2000 });
              dispatch(logout());
              setTimeout(() => navigate("/login"), 600);
            }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
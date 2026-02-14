import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from '../../features/auth/authSlice'
import { useNavigate } from "react-router-dom";
import { LogOut, Briefcase, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function CandidateDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {user?.name || "Candidate"}
              </h1>
              <p className="mt-3 text-indigo-100 text-lg">
                Find your next career opportunity
              </p>
            </div>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "C"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center md:text-left">
          What would you like to do?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Browse Jobs */}
          <div
            onClick={() => navigate("/jobs")}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                Browse Jobs
              </h3>
            </div>
            <p className="text-slate-600">
              Explore thousands of open positions matching your skills
            </p>
          </div>

          {/* My Applications */}
          <div
            onClick={() => navigate("/my-applications")}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                My Applications
              </h3>
            </div>
            <p className="text-slate-600">
              Track the status of all your job applications
            </p>
          </div>

          {/* Saved Jobs (placeholder) */}
          <div className="bg-white/60 rounded-2xl shadow-md p-8 border border-slate-200 opacity-70">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-600">
                Saved Jobs
              </h3>
            </div>
            <p className="text-slate-500">Coming soon</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              toast.success("Logged out successfully");
              dispatch(logout());
              setTimeout(() => {
                navigate("/login"); 
              }, 300); 
            }}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition mx-auto"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
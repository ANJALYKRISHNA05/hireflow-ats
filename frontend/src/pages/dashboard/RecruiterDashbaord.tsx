import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from '../../features/auth/authSlice'
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, Briefcase } from "lucide-react";

export default function RecruiterDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {user?.name || "Recruiter"}
              </h1>
              <p className="mt-3 text-purple-100 text-lg">
                Find and hire great talent
              </p>
            </div>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "R"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center md:text-left">
          Get Started
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Post a New Job */}
          <div
            onClick={() => navigate("/post-job")}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <PlusCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                Post a New Job
              </h3>
            </div>
            <p className="text-slate-600">
              Create a job opening and reach qualified candidates
            </p>
          </div>

          
          <div
            onClick={() => navigate("/my-jobs")}
            className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                My Posted Jobs
              </h3>
            </div>
            <p className="text-slate-600">
              View, edit, or manage applicants for your jobs
            </p>
          </div>

          
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-600">Analytics</h3>
            </div>
            <p className="text-slate-500">Coming soon</p>
          </div>
        </div>

     
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              dispatch(logout());           
              navigate("/login");          
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
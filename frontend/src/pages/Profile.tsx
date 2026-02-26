import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import api from "../api/api";
import toast from "react-hot-toast";
import { User, Briefcase, FileText, Calendar, Mail, Shield, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProfileData {
  name: string;
  email: string;
  role: "candidate" | "recruiter";
  createdAt?: string;
  applicationsCount?: number;
  jobsPostedCount?: number;
}

export default function Profile() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/current");
        const data = res.data.user;

        let applicationsCount = 0;
        let jobsPostedCount = 0;

        if (data.role === "candidate") {
          try {
            const appsRes = await api.get("/applications/my");
            applicationsCount = appsRes.data.applications?.length || 0;
          } catch {}
        } else if (data.role === "recruiter") {
          try {
            const jobsRes = await api.get("/jobs/my");
            jobsPostedCount = jobsRes.data.jobs?.length || 0;
          } catch {}
        }

        setProfile({
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
          applicationsCount,
          jobsPostedCount,
        });
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load profile";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error || "Could not load profile."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-indigo-700 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Top Section - Compact & Elegant */}
          <div className="px-8 pt-10 pb-8 bg-gradient-to-b from-slate-50 to-white text-center">
            <div className="inline-block relative mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-5xl font-semibold text-indigo-700 shadow-md border-4 border-white">
                {profile.name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full border-2 border-white capitalize">
                {profile.role}
              </span>
            </div>

            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              {profile.name || "Your Profile"}
            </h1>
            <p className="text-slate-600 flex items-center justify-center gap-2">
              <Mail size={16} className="text-slate-500" />
              {profile.email}
            </p>
          </div>

          {/* Main Info */}
          <div className="px-8 pb-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Account Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <User size={20} className="text-indigo-600" />
                  Account Details
                </h2>

                <div className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-800">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Joined</p>
                      <p className="font-medium text-slate-800">
                        {formatDistanceToNow(new Date(profile.createdAt!), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats - Elegant Circular Counters */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  {profile.role === "candidate" ? (
                    <FileText size={20} className="text-indigo-600" />
                  ) : (
                    <Briefcase size={20} className="text-indigo-600" />
                  )}
                  {profile.role === "candidate" ? "Your Activity" : "Recruiting Stats"}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shadow-inner border border-indigo-100">
                      <span className="text-3xl font-bold text-indigo-700">
                        {profile.role === "candidate"
                          ? profile.applicationsCount || 0
                          : profile.jobsPostedCount || 0}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 font-medium">
                      {profile.role === "candidate" ? "Applications" : "Jobs Posted"}
                    </p>
                  </div>

                  {/* Future Stat Placeholder */}
                  <div className="text-center opacity-70">
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center shadow-inner border border-slate-200">
                      <span className="text-3xl font-bold text-slate-400">—</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">More soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => toast("Edit profile coming soon!", { icon: "✨" })}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                Edit Profile
              </button>

              <button
                onClick={() =>
                  navigate(profile.role === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard")
                }
                className="px-8 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
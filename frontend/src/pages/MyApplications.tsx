// src/pages/MyApplications.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import api from "../api/api";
import toast from "react-hot-toast";
import { FileText, Briefcase, MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";  // ← added isValid import

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
  };
  status: "applied" | "shortlisted" | "interviewed" | "rejected" | "hired";
  resumeUrl: string;
  coverLetterUrl?: string;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

export default function MyApplications() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to safely format relative time
  const formatSafeDistance = (dateStr?: string | null, fallback = "unknown date") => {
    if (!dateStr) return fallback;

    const date = new Date(dateStr);
    if (!isValid(date)) return fallback;

    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/applications/my");
        setApplications(response.data.applications || []);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load your applications";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthenticated, navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":     return "bg-blue-100 text-blue-800";
      case "shortlisted": return "bg-purple-100 text-purple-700";
      case "interviewed": return "bg-green-100 text-green-800";
      case "rejected":    return "bg-red-100 text-red-800";
      case "hired":       return "bg-emerald-100 text-emerald-800";
      default:            return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Applications</h1>
            <p className="mt-2 text-slate-600">
              Track the status of all your job applications
            </p>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Briefcase size={18} />
            Browse More Jobs
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-3">
              No applications yet
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Start applying to jobs to see them appear here. Your application history and status updates will be shown in this section.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg"
            >
              Find Jobs Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  {/* Left - Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0">
                        {app.job.companyName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                          {app.job.title || "Untitled Position"}
                        </h3>
                        <p className="text-indigo-600 font-medium mt-1">
                          {app.job.companyName || "Company not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {app.job.location || "Not specified"}
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {formatSafeDistance(app.appliedAt, "Applied date unavailable")}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatSafeDistance(app.updatedAt, "Update date unavailable")}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                      >
                        <FileText size={16} />
                        View Resume
                      </a>

                      {app.coverLetterUrl && (
                        <a
                          href={app.coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
                        >
                          <FileText size={16} />
                          View Cover Letter
                        </a>
                      )}
                    </div>

                    {/* Recruiter notes */}
                    {app.notes && (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <p className="text-sm text-amber-800">
                          <strong>Recruiter Note:</strong> {app.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right - Status */}
                  <div className="min-w-[180px] md:text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-medium text-sm capitalize ${getStatusColor(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/candidate/dashboard")}
            className="text-slate-600 hover:text-indigo-600 transition flex items-center gap-2 mx-auto"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
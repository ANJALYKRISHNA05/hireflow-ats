// src/pages/MyApplications.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import api from "../api/api";
import toast from "react-hot-toast";
import { 
  FileText, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ArrowLeft   // ← ADD THIS HERE
} from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
  } | null;
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
    switch (status?.toLowerCase() || "") {
      case "applied":     return "bg-blue-100 text-blue-800";
      case "shortlisted": return "bg-purple-100 text-purple-700";
      case "interviewed": return "bg-green-100 text-green-800";
      case "rejected":    return "bg-red-100 text-red-800";
      case "hired":       return "bg-emerald-100 text-emerald-800";
      default:            return "bg-gray-100 text-gray-800";
    }
  };

  const handleWithdraw = (appId: string, jobTitle: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 w-80">
          <p className="text-slate-800 font-medium">
            Withdraw application for "{jobTitle}"?
          </p>
          <p className="text-sm text-slate-600">
            This cannot be undone. The recruiter will no longer see your application.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/applications/${appId}`);
                  toast.success("Application withdrawn successfully");
                  setApplications((prev) => prev.filter((app) => app._id !== appId));
                } catch (err: any) {
                  toast.error(err.response?.data?.message || "Failed to withdraw application");
                }
              }}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              Yes, Withdraw
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      }
    );
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
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/candidate/dashboard")}
              className="p-3 rounded-full bg-white shadow-md hover:bg-slate-50 transition text-slate-700 hover:text-indigo-700"
              title="Back to Dashboard"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Applications</h1>
              <p className="mt-1 text-slate-600">
                Track the status of all your job applications
              </p>
            </div>
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
            {applications.map((app) => {
              const job = app.job || {}; // safe fallback

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0">
                          {job.companyName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                            {job.title || "Untitled Position"}
                          </h3>
                          <p className="text-indigo-600 font-medium mt-1">
                            {job.companyName || "Company not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {job.location || "Not specified"}
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

                      {app.notes && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <p className="text-sm text-amber-800">
                            <strong>Recruiter Note:</strong> {app.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="min-w-[180px] md:text-right flex flex-col items-end gap-3">
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-medium text-sm capitalize ${getStatusColor(app.status)}`}
                      >
                        {app.status || "Unknown"}
                      </span>

                      {app.status === "applied" && (
                        <button
                          onClick={() => handleWithdraw(app._id, job.title || "this job")}
                          className="mt-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition flex items-center gap-2 text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

       
      </div>
    </div>
  );
}
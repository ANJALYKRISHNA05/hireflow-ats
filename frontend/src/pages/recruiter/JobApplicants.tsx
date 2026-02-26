// frontend/src/pages/recruiter/JobApplicants.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import { FileText, User, Briefcase, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Application {
  _id: string;
  candidate: {
    name: string;
    email: string;
  };
  status: "applied" | "shortlisted" | "interviewed" | "rejected" | "hired";
  resumeUrl: string;
  coverLetterUrl?: string;
  appliedAt: string;
  notes?: string;
}

export default function JobApplicants() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "interviewed", label: "Interviewed" },
    { value: "rejected", label: "Rejected" },
    { value: "hired", label: "Hired" },
  ];

  useEffect(() => {
    if (!jobId) {
      navigate("/my-jobs");
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/applications/job/${jobId}`);
        setApplications(response.data.applications || []);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load applications";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, navigate]);

  const handleStatusChange = async (appId: string, newStatus: string, notes: string = "") => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        notes: notes.trim() || undefined,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus as any, notes } : app
        )
      );

      toast.success("Application status updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700 mb-6">{error || "Invalid job ID"}</p>
          <button
            onClick={() => navigate("/my-jobs")}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/my-jobs")}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
        >
          ← Back to My Jobs
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Applications
        </h1>
        <p className="text-slate-600 mb-10">Review and manage candidates for this position</p>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              No applications yet
            </h2>
            <p className="text-slate-600">
              Candidates will appear here once they apply to this job.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {app.candidate.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">
                          {app.candidate.name}
                        </h3>
                        <p className="text-slate-600">{app.candidate.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
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
                      <div className="bg-slate-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-slate-700">
                          <strong>Notes:</strong> {app.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="min-w-[220px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updatingId === app._id}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {updatingId === app._id && (
                      <p className="text-xs text-indigo-600 mt-2 text-center">
                        Updating...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
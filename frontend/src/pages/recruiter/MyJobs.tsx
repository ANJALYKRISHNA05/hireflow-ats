// frontend/src/pages/recruiter/MyJobs.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import { Briefcase, Users, Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  createdAt: string;
  status: string;
}

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/jobs/my");
        setJobs(response.data.jobs || []);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load your jobs";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 w-80">
          <p className="text-slate-800 font-medium">
            Delete "{jobTitle}"?
          </p>
       
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDelete(jobId);
              }}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              Yes, Delete
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

  const performDelete = async (jobId: string) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job deleted successfully");

      // Optimistic UI: remove from list immediately
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete job";
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading your posted jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-slate-700 mb-6">{error}</p>
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
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Posted Jobs</h1>
            <p className="mt-2 text-slate-600">
              Manage your job postings and review applications
            </p>
          </div>
          <button
            onClick={() => navigate("/post-job")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Briefcase size={18} />
            Post New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              You haven't posted any jobs yet
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Start attracting talent by creating your first job opening.
            </p>
            <button
              onClick={() => navigate("/post-job")}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-xl font-semibold text-slate-800 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-indigo-600 font-medium">{job.companyName}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} />
                      {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        job.status === "open"
                          ? "bg-green-100 text-green-700"
                          : job.status === "closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                  {/* Edit Button */}
                  <button
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Edit size={18} />
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteJob(job._id, job.title)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>

                  {/* View Applicants */}
                  <button
                    onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Users size={18} />
                    Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
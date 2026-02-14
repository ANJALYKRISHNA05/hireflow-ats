import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import { getJobs } from "../api/jobs";
import type { Job } from "../types/job";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns"; // install: npm install date-fns

export default function Jobs() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getJobs();
        setJobs(data);
      } catch (err: any) {
        const message = err.message || "Failed to load jobs. Please try again.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Finding opportunities for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-slate-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 md:px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Find Your Next Opportunity
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            {jobs.length > 0
              ? `Discover ${jobs.length} open position${jobs.length === 1 ? "" : "s"}`
              : "No open positions right now — check back soon!"}
          </p>
        </div>

        {/* Jobs or Empty State */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              No jobs available at the moment
            </h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              We're constantly adding new opportunities. Come back soon!
            </p>
            <button
              onClick={() => navigate("/candidate/dashboard")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Card Header */}
                <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-xl font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-indigo-600 font-medium">
                    {job.companyName}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                      {job.experience}
                    </span>
                    {job.salaryRange && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        {job.salaryRange}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>📍 {job.location}</span>
                    {job.createdAt && (
                      <span className="text-slate-500">
                        • Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {job.skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          +{job.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition duration-200 shadow-sm hover:shadow-md"
                  >
                    View Details
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
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../api/jobs";
import type { Job } from "../types/job";
import toast from "react-hot-toast";
import { Briefcase, MapPin, DollarSign, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/jobs");
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getJobById(id);
        setJob(data);
      } catch (err: any) {
        const message = err.message || "Job not found or failed to load.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job not found</h2>
          <p className="text-slate-700 mb-6">{error || "This job may have been removed or is no longer available."}</p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/jobs")}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
        >
          ← Back to Jobs
        </button>

        {/* Job Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {job.title}
            </h1>
            <p className="text-xl text-indigo-600 font-medium">
              {job.companyName}
            </p>
          </div>

          {/* Key Info */}
          <div className="p-8 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Job Type</p>
                  <p className="font-medium text-slate-800">{job.jobType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium text-slate-800">{job.location}</p>
                </div>
              </div>

              {job.salaryRange && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-indigo-600 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500">Salary Range</p>
                    <p className="font-medium text-slate-800">{job.salaryRange}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Experience</p>
                  <p className="font-medium text-slate-800">{job.experience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="p-8 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div className="p-8 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Job Description</h3>
              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </div>
          )}

          {/* Footer / Apply Button */}
          <div className="p-8 bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-slate-500">
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </div>
              <button
                onClick={() => navigate(`/apply/${job._id}`)} // or open modal later
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
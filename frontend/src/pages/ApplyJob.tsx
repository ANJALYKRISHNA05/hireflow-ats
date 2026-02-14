import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { getJobById } from "../api/jobs";
import type { Job } from "../types/job";
import toast from "react-hot-toast";
import api from "../api/api";

export default function ApplyJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/jobs");
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(id);
        setJob(data);
      } catch (err: any) {
        toast.error("Could not load job details");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type & size (5MB max, PDF/DOC/DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, or DOCX files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (type === "resume") setResumeFile(file);
    else setCoverLetterFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Resume is required");
      return;
    }

    if (!id) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("jobId", id);
    formData.append("resume", resumeFile);
    if (coverLetterFile) formData.append("coverLetter", coverLetterFile);

    try {
      const res = await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully!");
      navigate("/my-applications"); // redirect to applications list (build later)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Preparing application...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job not found</h2>
          <p className="text-slate-700 mb-6">
            This job may have been removed or is no longer available.
          </p>
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
          onClick={() => navigate(`/jobs/${id}`)}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
        >
          ← Back to Job Details
        </button>

        {/* Job Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-10">
          <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Apply for: {job.title}
            </h1>
            <p className="text-xl text-indigo-600 font-medium">
              {job.companyName} • {job.location}
            </p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Upload Your Documents</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Resume - Required */}
              <div>
                <label className="block text-lg font-medium text-slate-700 mb-3">
                  Resume <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
                      {resumeFile ? (
                        <div className="text-indigo-600 font-medium">
                          {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-600 mb-2">Click to upload or drag & drop</p>
                          <p className="text-sm text-slate-500">PDF, DOC, DOCX (max 5MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "resume")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Cover Letter - Optional */}
              <div>
                <label className="block text-lg font-medium text-slate-700 mb-3">
                  Cover Letter (optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
                      {coverLetterFile ? (
                        <div className="text-indigo-600 font-medium">
                          {coverLetterFile.name} ({(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-600 mb-2">Click to upload or drag & drop</p>
                          <p className="text-sm text-slate-500">PDF, DOC, DOCX (max 5MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "cover")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting || !resumeFile}
                  className={`w-full py-4 rounded-xl text-white font-semibold transition shadow-lg ${
                    submitting || !resumeFile
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
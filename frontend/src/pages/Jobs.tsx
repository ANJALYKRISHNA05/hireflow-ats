import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import { getJobs } from "../api/jobs";
import type { Job } from "../types/job";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { Search, MapPin, Briefcase, DollarSign, X, ArrowLeft, SlidersHorizontal } from "lucide-react";

export default function Jobs() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  
  const [showFilters, setShowFilters] = useState(false);

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
        setFilteredJobs(data);
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

  
  useEffect(() => {
    let result = [...jobs];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          (job.description && job.description.toLowerCase().includes(term))
      );
    }

    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase().trim();
      result = result.filter((job) => job.location.toLowerCase().includes(loc));
    }

    if (jobTypeFilter !== "All") {
      result = result.filter((job) => job.jobType === jobTypeFilter);
    }

    if (experienceFilter.trim()) {
      const exp = experienceFilter.toLowerCase().trim();
      result = result.filter((job) => job.experience.toLowerCase().includes(exp));
    }

    if (salaryFilter.trim()) {
      const sal = salaryFilter.toLowerCase().trim();
      result = result.filter(
        (job) => job.salaryRange && job.salaryRange.toLowerCase().includes(sal)
      );
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, locationFilter, jobTypeFilter, experienceFilter, salaryFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setJobTypeFilter("All");
    setExperienceFilter("");
    setSalaryFilter("");
    setShowFilters(false);
  };

  const hasActiveFilters =
    searchTerm || locationFilter || jobTypeFilter !== "All" || experienceFilter || salaryFilter;

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
      <div className="container mx-auto max-w-7xl">
       
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/candidate/dashboard")}
              className="p-2 rounded-full bg-white shadow-sm hover:bg-slate-50 transition text-slate-700"
              title="Back to Dashboard"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Find Your Next Opportunity
              </h1>
              <p className="mt-1 text-slate-600">
                {filteredJobs.length > 0
                  ? `Showing ${filteredJobs.length} open position${filteredJobs.length === 1 ? "" : "s"}`
                  : "No matching jobs — adjust filters"}
              </p>
            </div>
          </div>

          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 transition font-medium"
          >
            <SlidersHorizontal size={20} />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* Filters Section */}
        <div
          className={`bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-10 transition-all duration-300 ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Search - spans more space */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Search size={18} className="text-indigo-600" />
                Search jobs
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="React, Developer, Full-stack, Bengaluru..."
                className="w-full px-4 py-3.5 pl-11 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" />
                Location
              </label>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Bengaluru, Kochi, Remote..."
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Briefcase size={18} className="text-indigo-600" />
                Job Type
              </label>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Experience
              </label>
              <input
                type="text"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                placeholder="Fresher, 2-5 years..."
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign size={18} className="text-indigo-600" />
                Salary Range
              </label>
              <input
                type="text"
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                placeholder="10-20 LPA..."
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end mt-6">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition font-medium border border-red-200 shadow-sm"
              >
                <X size={18} />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              No matching jobs found
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Try adjusting your search or filters — there are plenty of opportunities waiting!
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg inline-flex items-center gap-2"
            >
              <X size={20} />
              Clear Filters & Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-xl font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-indigo-600 font-medium">{job.companyName}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
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
                    <MapPin size={16} />
                    <span>{job.location}</span>
                    {job.createdAt && (
                      <span className="ml-2 text-slate-500">
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
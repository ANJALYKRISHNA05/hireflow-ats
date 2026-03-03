// frontend/src/pages/Profile.tsx
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import api from "../api/api";
import toast from "react-hot-toast";
import { User, Mail, Calendar, ArrowLeft, Camera, Briefcase, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProfileData {
  name: string;
  email: string;
  role: "candidate" | "recruiter";
  profilePicUrl?: string | null;
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

  // Profile picture states
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        // Set initial profile picture preview
        if (data.profilePicUrl) {
          setPreviewUrl(data.profilePicUrl);
        }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (jpg, png, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const res = await api.patch("/users/current", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile picture updated!");
      const newPicUrl = res.data.user.profilePicUrl;

      setProfile((prev) => prev ? { ...prev, profilePicUrl: newPicUrl } : null);
      setPreviewUrl(newPicUrl);
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload picture");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(profile?.profilePicUrl || null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
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
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-indigo-700 transition font-medium"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Profile Header - Compact & Elegant */}
          <div className="px-8 pt-10 pb-8 bg-gradient-to-b from-slate-50 to-white text-center">
            <div className="relative inline-block mb-6 group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-6xl font-semibold text-indigo-600">
                    {profile.name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Upload button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 bg-indigo-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-700"
                title="Change profile picture"
              >
                <Camera size={20} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Upload controls - only show when file selected */}
            {selectedFile && (
              <div className="mb-6 flex justify-center gap-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Save Picture"}
                </button>
                <button
                  onClick={handleCancelUpload}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            )}

            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              {profile.name || "Your Profile"}
            </h1>

            <div className="flex items-center justify-center gap-4 flex-wrap mt-3">
              <p className="text-slate-600 flex items-center gap-2">
                <Mail size={16} className="text-slate-500" />
                {profile.email}
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full capitalize">
                <Shield size={14} />
                {profile.role}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-10 md:px-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Account Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <User size={20} className="text-indigo-600" />
                  Account Details
                </h2>

                <div className="bg-slate-50/60 p-6 rounded-xl border border-slate-100 space-y-5">
                  <div className="flex items-center gap-4">
                    <Mail size={18} className="text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                      <p className="font-medium text-slate-800">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Calendar size={18} className="text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Joined</p>
                      <p className="font-medium text-slate-800">
                        {formatDistanceToNow(new Date(profile.createdAt!), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  {profile.role === "candidate" ? (
                    <FileText size={20} className="text-indigo-600" />
                  ) : (
                    <Briefcase size={20} className="text-indigo-600" />
                  )}
                  {profile.role === "candidate" ? "Your Activity" : "Recruiting Activity"}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shadow-inner border border-indigo-100">
                      <span className="text-4xl font-bold text-indigo-700">
                        {profile.role === "candidate" ? profile.applicationsCount || 0 : profile.jobsPostedCount || 0}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      {profile.role === "candidate" ? "Applications" : "Jobs Posted"}
                    </p>
                  </div>

                  <div className="text-center opacity-70">
                    <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 flex items-center justify-center shadow-inner border border-slate-200">
                      <span className="text-4xl font-bold text-slate-400">—</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">More coming</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => toast("Edit profile feature coming soon!", { icon: "✨" })}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm hover:shadow-md"
              >
                Edit Profile
              </button>

              <button
                onClick={() =>
                  navigate(profile.role === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard")
                }
                className="px-8 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-lg transition shadow-sm hover:shadow"
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
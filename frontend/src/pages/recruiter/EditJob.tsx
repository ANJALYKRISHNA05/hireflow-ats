// src/pages/recruiter/EditJob.tsx
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";
import { getJobById } from "../../api/jobs"; // assuming you have this helper

const jobSchema = Yup.object({
  title: Yup.string().min(5, "Title must be at least 5 characters").required("Job title is required"),
  description: Yup.string().min(50, "Description must be at least 50 characters").required("Description is required"),
  companyName: Yup.string().required("Company name is required"),
  location: Yup.string().required("Location is required"),
  salaryRange: Yup.string(),
  jobType: Yup.string().oneOf(["Full-time", "Part-time", "Contract", "Internship"]).required("Job type is required"),
  experience: Yup.string().required("Experience level is required"),
  skills: Yup.array().of(Yup.string()).min(1, "At least one skill is required").required("Skills are required"),
  status: Yup.string().oneOf(["open", "closed", "paused"]),
});

export default function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // job ID from URL
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid job ID");
      navigate("/my-jobs");
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const job = await getJobById(id); // reuse your existing helper

        setInitialValues({
          title: job.title || "",
          description: job.description || "",
          companyName: job.companyName || "",
          location: job.location || "",
          salaryRange: job.salaryRange || "",
          jobType: job.jobType || "Full-time",
          experience: job.experience || "",
          skills: job.skills || [""],
          status: job.status || "open",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load job details");
        navigate("/my-jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!initialValues) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/my-jobs")}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
        >
          ← Back to My Jobs
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Edit Job Posting
          </h1>
          <p className="text-slate-600 mb-10">Update the details of your job opening</p>

          <Formik
            initialValues={initialValues}
            validationSchema={jobSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await api.put(`/jobs/${id}`, values);
                toast.success("Job updated successfully!");
                navigate("/my-jobs");
              } catch (err: any) {
                toast.error(err.response?.data?.message || "Failed to update job");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Same fields as PostJob.tsx – copy-paste them here */}
                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <ErrorMessage name="title" component="p" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={6}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                  <ErrorMessage name="description" component="p" className="text-red-600 text-sm mt-1" />
                </div>

                {/* ... copy the rest of the form fields from PostJob.tsx ... */}
                {/* Including companyName, location, salaryRange, jobType, experience, skills array, status */}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg disabled:opacity-60"
                  >
                    {isSubmitting ? "Updating Job..." : "Update Job"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from '../../api/api'
import toast from "react-hot-toast";

const jobSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .required("Job title is required"),
  description: Yup.string()
    .min(50, "Description must be at least 50 characters")
    .required("Description is required"),
  companyName: Yup.string().required("Company name is required"),
  location: Yup.string().required("Location is required"),
  salaryRange: Yup.string(),
  jobType: Yup.string()
    .oneOf(["Full-time", "Part-time", "Contract", "Internship"])
    .required("Job type is required"),
  experience: Yup.string().required("Experience level is required"),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, "At least one skill is required")
    .required("Skills are required"),
});

export default function PostJob() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Post a New Job
          </h1>
          <p className="text-slate-600 mb-10">
            Fill in the details to attract the best candidates
          </p>

          <Formik
            initialValues={{
              title: "",
              description: "",
              companyName: "",
              location: "",
              salaryRange: "",
              jobType: "Full-time",
              experience: "",
              skills: [""],
            }}
            validationSchema={jobSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await api.post("/jobs", values);
                toast.success("Job posted successfully!");
                navigate("/my-jobs");
              } catch (err: any) {
                toast.error(
                  err.response?.data?.message || "Failed to post job"
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8">
                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-red-600 text-sm mt-1"
                  />
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
                  <ErrorMessage
                    name="description"
                    component="p"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-slate-700 mb-2">
                      Company Name <span className="text-red-600">*</span>
                    </label>
                    <Field
                      name="companyName"
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <ErrorMessage
                      name="companyName"
                      component="p"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-slate-700 mb-2">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <Field
                      name="location"
                      placeholder="Bengaluru, India"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <ErrorMessage
                      name="location"
                      component="p"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-slate-700 mb-2">
                      Salary Range (optional)
                    </label>
                    <Field
                      name="salaryRange"
                      placeholder="₹15-25 LPA"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-slate-700 mb-2">
                      Experience Level <span className="text-red-600">*</span>
                    </label>
                    <Field
                      name="experience"
                      placeholder="e.g. 3-5 years"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <ErrorMessage
                      name="experience"
                      component="p"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Job Type <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="jobType"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Skills Required <span className="text-red-600">*</span>
                  </label>
                  {values.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Field
                        name={`skills[${index}]`}
                        placeholder="e.g. React, TypeScript"
                        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      {index === values.skills.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setFieldValue("skills", [...values.skills, ""])}
                          className="px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                        >
                          +
                        </button>
                      )}
                      {values.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "skills",
                              values.skills.filter((_, i) => i !== index)
                            )
                          }
                          className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                          −
                        </button>
                      )}
                    </div>
                  ))}
                  <ErrorMessage
                    name="skills"
                    component="p"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg disabled:opacity-60"
                  >
                    {isSubmitting ? "Posting Job..." : "Post Job"}
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
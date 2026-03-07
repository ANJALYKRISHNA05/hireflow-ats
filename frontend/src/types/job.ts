export interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  skills: string[];
  salaryRange?: string;
  description?: string; 
  status: "open" | "closed" | "paused";
  postedBy?: string;
  createdAt: string;
}
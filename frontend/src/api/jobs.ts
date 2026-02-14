// src/api/jobs.ts
import api from "./api";
import type { Job } from "../types/job";

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await api.get("/jobs");
    return response.data.jobs || []; 
  } catch (error: any) {
    console.error("Failed to fetch jobs:", error);
    throw new Error(error.response?.data?.message || "Could not load jobs");
  }
};

export const getJobById = async (id: string): Promise<Job> => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data.job;
  } catch (error: any) {
    console.error(`Failed to fetch job ${id}:`, error);
    throw new Error(error.response?.data?.message || "Job not found");
  }
};
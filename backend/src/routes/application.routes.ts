import { Router } from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/application.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../types/roles";
import { uploadFields } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  uploadFields,
  applyToJob,
);

router.get(
  "/my",
  authenticate,
  authorize(UserRole.CANDIDATE),
  getMyApplications,
);

router.get(
  "/job/:jobId",
  authenticate,
  authorize(UserRole.RECRUITER),
  getApplicationsForJob,
);

router.put(
  "/:id/status",
  authenticate,
  authorize(UserRole.RECRUITER),
  updateApplicationStatus,
);

export default router;

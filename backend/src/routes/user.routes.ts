import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { updateCurrentUser } from "../controllers/user.controller";
import { UserRole } from "../types/roles";
const router = Router();
router.get("/current", authenticate, getCurrentUser);
router.patch("/current", authenticate, updateCurrentUser);
router.get(
  "/recruiter-only",
  authenticate,
  authorize(UserRole.RECRUITER),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, Recruiter! This is recruiter-only content.",
    });
  },
);
export default router;

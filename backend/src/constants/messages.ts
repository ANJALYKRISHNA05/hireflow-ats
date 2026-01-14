export const Messages = {
 
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Token has expired",
  INVALID_TOKEN: "Invalid token",
  LOGOUT_SUCCESS: "Logged out successfully",
  REFRESH_TOKEN_SUCCESS: "Token refreshed successfully",
  EMAIL_ALREADY_EXISTS:"Email already exists",

 
  SERVER_ERROR: "Internal server error",
  RESOURCE_NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden: insufficient permissions",

  
  CANDIDATE_CREATED: "Candidate profile created",
  JOB_CREATED: "Job posting created",
} as const;
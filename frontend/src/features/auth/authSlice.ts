import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter';
}

type OtpPurpose = 'login' | 'register' | null;

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  otpRequired: boolean;
  otpPurpose: OtpPurpose;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  otpRequired: false,
  otpPurpose: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken?: string;
        user?: User;
        otpRequired?: boolean;
        otpPurpose?: OtpPurpose;
      }>
    ) {
   
    if (action.payload.otpRequired) {
  state.otpRequired = true;
  state.otpPurpose = action.payload.otpPurpose ?? null;
  state.isAuthenticated = false;
  return;
}


      state.accessToken = action.payload.accessToken || null;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;

    
      state.otpRequired = false;
      state.otpPurpose = null;
    },

    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.otpRequired = false;
      state.otpPurpose = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

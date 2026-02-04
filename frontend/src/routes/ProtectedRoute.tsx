import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated, otpRequired } = useSelector(
    (state: RootState) => state.auth
  );

  
  if (otpRequired) {
    return <Navigate to="/verify-otp" replace />;
  }

 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

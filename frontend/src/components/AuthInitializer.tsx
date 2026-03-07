import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../api/api';
import { restoreAuth, logout } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

 useEffect(() => {
  const initAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) return;

    try {
      
      const res = await api.get("/users/current", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(
        restoreAuth({
          accessToken,
          refreshToken,
          user: res.data.user,
        })
      );
    } catch (err: any) {
    
      try {
        const refreshRes = await api.post("/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = refreshRes.data.accessToken;
        const newRefreshToken = refreshRes.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        const userRes = await api.get("/users/current", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });

        dispatch(
          restoreAuth({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: userRes.data.user,
          })
        );
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
      }
    }
  };

  initAuth();
}, [dispatch]);

  return <>{children}</>;
}
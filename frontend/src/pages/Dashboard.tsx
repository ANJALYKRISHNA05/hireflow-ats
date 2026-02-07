import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
       
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Welcome back, {user.name ?? user.email.split('@')[0]}
                  </h1>
                  <p className="mt-2 text-indigo-100 opacity-90">
                    You're signed in as <span className="font-semibold">{user.role}</span>
                  </p>
                </div>

                <div className="hidden sm:block">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

           
            <div className="p-8 md:p-10">
              <div className="space-y-8">
              
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-800">Account Type</h3>
                    <p className="mt-2 text-2xl font-bold text-indigo-600 capitalize">{user.role}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                    <p className="mt-2 text-lg text-gray-700 break-all">{user.email}</p>
                  </div>
                </div>

               
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate('/login');
                    }}
                    className="
                      w-full sm:w-auto
                      px-8 py-3.5
                      bg-gradient-to-r from-red-500 to-rose-600
                      hover:from-red-600 hover:to-rose-700
                      text-white font-medium
                      rounded-lg shadow-lg
                      hover:shadow-xl
                      transform hover:-translate-y-0.5
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                    "
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 text-center text-sm text-gray-500">
              {new Date().getFullYear()} • Hireflow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
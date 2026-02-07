import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
     
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center text-4xl font-bold">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name || 'User'}</h1>
                <p className="mt-1 opacity-90">{user.email}</p>
                <span className="inline-block mt-3 px-4 py-1 bg-white/20 rounded-full text-sm font-medium capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-medium text-gray-700 mb-2">Full Name</h3>
                <p className="text-lg">{user.name || 'Not set'}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-medium text-gray-700 mb-2">Email</h3>
                <p className="text-lg break-all">{user.email}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-medium text-gray-700 mb-2">Account Type</h3>
                <p className="text-lg capitalize">{user.role}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-medium text-gray-700 mb-2">Member Since</h3>
                <p className="text-lg">— (to be added later)</p>
              </div>
            </div>

           
            {user.role === 'candidate' && (
              <div className="mt-10 pt-8 border-t">
                <h2 className="text-xl font-semibold mb-4">Candidate Information</h2>
                <p className="text-gray-600">
                  This section will show your resume, skills, experience, etc. 
                </p>
              </div>
            )}

            {user.role === 'recruiter' && (
              <div className="mt-10 pt-8 border-t">
                <h2 className="text-xl font-semibold mb-4">Recruiter Information</h2>
                <p className="text-gray-600">
                  Company name, website, jobs posted, etc.
                </p>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="mt-10 pt-8 border-t">
                <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
                <p className="text-gray-600">
                  User management, system stats, etc. 
                </p>
              </div>
            )}

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
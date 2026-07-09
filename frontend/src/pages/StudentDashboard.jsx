import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Student Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.fullName || 'Student'}</h2>
                  <p className="text-sm text-gray-500">Register No: {user.registerNumber}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">My Profile</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Department</span>
                    <span>{user.department || 'N/A'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-500">Batch</span>
                    <span>{user.batch || 'N/A'}</span>
                  </li>
                </ul>
                <button className="mt-6 w-full text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg font-medium transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Registered Events Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">My Registered Events</h3>
                <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Browse Events</Link>
              </div>
              
              {/* Placeholder for Events */}
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-900">No events registered yet</h4>
                <p className="mt-1 text-sm text-gray-500 max-w-sm">
                  You haven't registered for any upcoming campus events. Browse the events page to get started.
                </p>
                <Link to="/" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm">
                  Find Events
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

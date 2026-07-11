import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: user.fullName || '',
    department: user.department || '',
    yearOfStudy: user.yearOfStudy || '',
  });

  const departments = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Botany', 'Microbiology', 'Commerce'
  ];
  const yearsOfStudy = ['First Year', 'Second Year', 'Third Year'];

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://eventwave-t6v4.onrender.com/api/auth/profile/${user.id}`, editFormData);
      toast.success(response.data.message || 'Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get('https://eventwave-t6v4.onrender.com/api/events');
        // Filter events where this user's ID is in the registeredStudents array
        const myEvents = response.data.filter(event => 
          event.registeredStudents.some(student => student._id === user.id || student === user.id)
        );
        setRegisteredEvents(myEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load registered events.');
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchRegisteredEvents();
    } else {
      setLoading(false);
    }
  }, [user.id]);

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
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.fullName || 'Student'}</h2>
                    <p className="text-sm text-gray-500">Register No: {user.registerNumber}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">My Profile</h3>
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} autoComplete="off" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" name="fullName" value={editFormData.fullName} onChange={handleEditChange} required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select name="department" value={editFormData.department} onChange={handleEditChange} required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="" disabled>Select Dept</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                      <select name="yearOfStudy" value={editFormData.yearOfStudy} onChange={handleEditChange} required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="" disabled>Select Year</option>
                        {yearsOfStudy.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Register Number (Read-only)</label>
                      <input type="text" value={user.registerNumber} disabled className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-2.5 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Read-only)</label>
                      <input type="text" value="" placeholder="No email associated" disabled className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-2.5 cursor-not-allowed" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                        Save Changes
                      </button>
                      <button type="button" onClick={() => {
                        setIsEditing(false);
                        setEditFormData({ fullName: user.fullName, department: user.department, yearOfStudy: user.yearOfStudy });
                      }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex justify-between">
                      <span className="font-medium text-gray-500">Department</span>
                      <span className="font-semibold text-gray-800">{user.department || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-gray-500">Batch</span>
                      <span className="font-semibold text-gray-800">{user.batch || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-gray-500">Year of Study</span>
                      <span className="font-semibold text-gray-800">{user.yearOfStudy || 'N/A'}</span>
                    </li>
                  </ul>
                )}
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
              
              {loading ? (
                <div className="flex justify-center py-12"><p className="text-gray-500">Loading events...</p></div>
              ) : registeredEvents.length === 0 ? (
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
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map(event => (
                    <div key={event._id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-blue-50/30">
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-4">
                        <span><strong className="text-gray-500">Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                        <span><strong className="text-gray-500">Location:</strong> {event.location}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

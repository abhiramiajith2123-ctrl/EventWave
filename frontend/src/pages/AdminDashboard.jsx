import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', imageUrl: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://eventwave-t6v4.onrender.com/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://eventwave-t6v4.onrender.com/api/events', formData);
      toast.success('Event added successfully!');
      setFormData({ title: '', description: '', date: '', location: '', imageUrl: '' });
      setShowCreateForm(false);
      fetchEvents(); // Refresh list
    } catch (error) {
      console.log(error);
      toast.error('Failed to create event.');
    }
  };

  const toggleRegistrations = (eventId) => {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(eventId);
    }
  };

  const downloadPDF = (event) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Registered Students - ${event.title}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date(event.date).toLocaleDateString()} | Location: ${event.location}`, 14, 30);
    
    if (event.registeredStudents && event.registeredStudents.length > 0) {
      const tableColumn = ["#", "Name", "Register Number", "Department", "Batch"];
      const tableRows = [];

      event.registeredStudents.forEach((student, index) => {
        const studentData = [
          index + 1,
          student.fullName,
          student.registerNumber,
          student.department,
          student.batch
        ];
        tableRows.push(studentData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 38,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    } else {
      doc.text("No students registered for this event yet.", 14, 40);
    }
    
    // Save the PDF
    doc.save(`${event.title.replace(/\s+/g, '_')}_Registrations.pdf`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Welcome back, {user.fullName || 'Admin'}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              {showCreateForm ? 'Cancel Form' : 'Create New Event'}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Event</h3>
            <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleFormChange} required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleFormChange} required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} required rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6">
            <h3 className="text-xl font-bold text-gray-900">Manage Events & Registrations</h3>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500">No active events found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {events.map((event) => (
                  <div key={event._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(event.date).toLocaleDateString()} &bull; {event.location}
                        </p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                      </div>
                      <div className="text-right flex flex-col items-end shrink-0 ml-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {event.registeredStudents?.length || 0} Registered
                        </span>
                        <button 
                          onClick={() => toggleRegistrations(event._id)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                        >
                          {expandedEventId === event._id ? 'Hide Registrations' : 'View Registrations'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Registrations List Dropdown */}
                    {expandedEventId === event._id && (
                      <div className="mt-6 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                          <h5 className="font-semibold text-gray-800">Registered Students</h5>
                          <button
                            onClick={() => downloadPDF(event)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download PDF
                          </button>
                        </div>
                        {event.registeredStudents && event.registeredStudents.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.registeredStudents.map((student) => (
                              <div key={student._id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col">
                                <span className="font-bold text-gray-900">{student.fullName}</span>
                                <span className="text-xs text-gray-500 mt-1">{student.department} &bull; Batch: {student.batch}</span>
                                <span className="font-mono text-xs text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-1 rounded w-fit">
                                  {student.registerNumber}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 italic bg-gray-50 rounded-lg">
                            No one has registered for this event yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function Navigation() {
  const location = useLocation(); // Forces re-render on route change
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'student') return '/student-dashboard';
    return '/login';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tighter">EventWave</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            {user ? (
              <Link to={getDashboardLink()} className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
                {role === 'student' ? 'My Profile' : 'Admin Panel'}
              </Link>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://eventwave-t6v4.onrender.com/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to fetch events from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterForEvent = async (eventId) => {
    if (!user || role !== 'student') {
      toast.info('Please log in as a student to register for events.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`https://eventwave-t6v4.onrender.com/api/events/${eventId}/register`, {
        studentId: user.id
      });
      toast.success('Successfully registered for the event!');
      
      // Update local state to reflect registration
      setEvents(events.map(event => {
        if (event._id === eventId) {
          return { ...event, registeredStudents: [...(event.registeredStudents || []), user.id] };
        }
        return event;
      }));
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register for the event.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8 text-center shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover and Join <br className="hidden sm:block" />
            <span className="text-blue-200">Campus Events</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            EventWave is your premier platform to explore, register, and manage upcoming activities at your college. Never miss out on what's happening!
          </p>
          <a href="#events" className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 inline-block">
            Explore Events
          </a>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Check out what's on the horizon and secure your spot today.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">Check back later for new campus events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const isRegistered = user && role === 'student' && 
                event.registeredStudents?.some(student => (student._id || student) === user.id);
              
              const fallbackImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
              const displayImage = event.imageUrl || fallbackImage;

              return (
                <div key={event._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                  <div className="h-48 relative">
                     <img src={displayImage} alt={event.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                     {isRegistered && (
                       <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                         Registered
                       </span>
                     )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>

                    <p className="text-gray-600 line-clamp-3 mb-6 flex-1">{event.description}</p>
                    
                    {role === 'admin' ? (
                      <Link to="/admin-dashboard" className="mt-auto w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 text-center">
                        Manage Event
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleRegisterForEvent(event._id)}
                        disabled={isRegistered}
                        className={`mt-auto w-full font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 ${
                          isRegistered 
                            ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isRegistered ? 'Already Registered' : 'Register for Event'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Navigation />
        
        <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
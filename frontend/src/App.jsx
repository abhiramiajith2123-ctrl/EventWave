import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';

function Home() {
  const dummyEvents = [
    {
      id: 1,
      title: "Tech Symposium 2026",
      date: "2026-08-15",
      location: "Main Auditorium",
      description: "Join us for an exciting day of tech talks, workshops, and networking with industry leaders.",
    },
    {
      id: 2,
      title: "Cultural Fest: Rhythm & Hues",
      date: "2026-09-20",
      location: "Open Air Theatre",
      description: "Experience a vibrant celebration of art, music, and dance from diverse cultures across the globe.",
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      date: "2026-10-05",
      location: "Innovation Hub",
      description: "Got a groundbreaking idea? Pitch it to top investors and win seed funding for your startup.",
    },
    {
      id: 4,
      title: "Annual Sports Meet",
      date: "2026-11-12",
      location: "University Sports Complex",
      description: "Compete in various track and field events and cheer for your department to win the championship trophy.",
    }
  ];

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
          <button className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
            Explore Events
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Check out what's on the horizon and secure your spot today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                 <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
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
                
                <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300">
                  Register for Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AddEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location
      };
      await axios.post('https://eventwave-t6v4.onrender.com/api/events', payload);
      toast.success('Event added successfully!');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Failed to create event. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        width: '100%',
        maxWidth: '500px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '28px', fontWeight: '800' }}>Create Event</h2>
        
        {/* Message state has been replaced with browser alert */}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</label>
            <input 
              type="text" name="title" value={formData.title} onChange={handleChange} required
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', transition: 'background 0.3s ease'
              }}
              onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
              onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.6)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} required rows="4"
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', transition: 'background 0.3s ease'
              }}
              onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
              onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.6)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</label>
            <input 
              type="date" name="date" value={formData.date} onChange={handleChange} required
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', transition: 'background 0.3s ease', color: '#333'
              }}
              onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
              onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.6)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</label>
            <input 
              type="text" name="location" value={formData.location} onChange={handleChange} required
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', transition: 'background 0.3s ease'
              }}
              onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
              onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.6)'}
            />
          </div>

          <button type="submit" style={{
            padding: '16px', borderRadius: '12px', border: 'none', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px',
            boxShadow: '0 4px 15px rgba(0,242,254,0.4)', transition: 'all 0.3s ease'
          }} 
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,242,254,0.6)'; }} 
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,242,254,0.4)'; }}>
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tighter">EventWave</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link to="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">Login</Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
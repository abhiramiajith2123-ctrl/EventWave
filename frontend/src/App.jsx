import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://eventwave-t6v4.onrender.com/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://eventwave-t6v4.onrender.com/api/events/${id}`);
      setEvents(events.filter(event => (event._id || event.id) !== id));
      toast.info('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to EventWave - Campus Event Management System</p>
      
      {events.length === 0 ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#666' }}>No events found. Please add some!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {events.map((event) => (
            <div key={event._id || event.id} style={{ position: 'relative', border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff', color: '#333' }}>
              <button 
                onClick={() => handleDelete(event._id || event.id)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete
              </button>
              <h3 style={{ marginTop: 0, color: '#222', paddingRight: '70px' }}>{event.title || event.name || 'Untitled Event'}</h3>
              <p style={{ margin: '8px 0' }}><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
              <p style={{ margin: '8px 0' }}><strong>Location:</strong> {event.location || 'N/A'}</p>
              <p style={{ margin: '12px 0 0', color: '#555', lineHeight: '1.5' }}>{event.description}</p>
            </div>
          ))}
        </div>
      )}
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
        <nav style={{ padding: '1rem', background: '#333', color: 'white', marginBottom: '2rem', borderRadius: '8px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '2rem', margin: 0, padding: 0 }}>
            <li>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
            </li>
            <li>
              <Link to="/add-event" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Add Event</Link>
            </li>
            <li>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            </li>
            <li>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
            </li>
          </ul>
        </nav>
        
        <div>
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
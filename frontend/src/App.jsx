import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to EventWave - Campus Event Management System</p>
    </div>
  );
}

function AddEvent() {
  return (
    <div>
      <h2>Add Event</h2>
      <p>Here you can add a new event.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '1rem', background: '#333', color: 'white', marginBottom: '2rem', borderRadius: '8px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '2rem', margin: 0, padding: 0 }}>
            <li>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
            </li>
            <li>
              <Link to="/add-event" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Add Event</Link>
            </li>
          </ul>
        </nav>
        
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-event" element={<AddEvent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
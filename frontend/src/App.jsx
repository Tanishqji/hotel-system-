import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={!user ? <Login /> : (user.role === 'patient' ? <Navigate to="/patient-dashboard" /> : <Navigate to="/doctor-dashboard" />)} />
                <Route path="/register" element={!user ? <Register /> : (user.role === 'patient' ? <Navigate to="/patient-dashboard" /> : <Navigate to="/doctor-dashboard" />)} />

                <Route path="/patient-dashboard" element={user && user.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} />
                <Route path="/doctor-dashboard" element={user && user.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;

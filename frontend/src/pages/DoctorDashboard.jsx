import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, Clock, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/appointments', {
                headers: { 'x-auth-token': user.token }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error('Failed to fetch appointments');
        }
    };

    return (
        <div className="container">
            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar size={28} /> Scheduled Appointments
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {appointments.length === 0 && <p>No scheduled appointments.</p>}
                    {appointments.map(app => (
                        <div key={app._id} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '1rem', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontWeight: 'bold', backgroundColor: app.status === 'booked' ? '#dcfce7' : '#fee2e2', color: app.status === 'booked' ? '#166534' : '#991b1b' }}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <User size={20} /> {app.patient.username}
                            </h3>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                                <Clock size={16} /> {new Date(app.date).toLocaleString()}
                            </p>
                            {app.status === 'booked' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>Complete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

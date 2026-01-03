import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, Clock, XCircle, PlusCircle } from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [bookingData, setBookingData] = useState({ doctorId: '', date: '' });

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        const res = await axios.get('http://localhost:5000/api/users/doctors');
        setDoctors(res.data);
    };

    const fetchAppointments = async () => {
        const res = await axios.get('http://localhost:5000/api/appointments', {
            headers: { 'x-auth-token': user.token }
        });
        setAppointments(res.data);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/appointments', bookingData, {
                headers: { 'x-auth-token': user.token }
            });
            alert('Appointment booked successfully');
            fetchAppointments();
        } catch (err) {
            alert('Failed to book appointment');
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/appointments/cancel/${id}`, {}, {
                headers: { 'x-auth-token': user.token }
            });
            fetchAppointments();
        } catch (err) {
            alert('Failed to cancel');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Book Appointment Section */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PlusCircle size={20} /> Book Appointment
                    </h3>
                    <form onSubmit={handleBook}>
                        <label>Select Doctor</label>
                        <select
                            className="input-field"
                            value={bookingData.doctorId}
                            onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                            required
                        >
                            <option value="">Choose a doctor</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>{doc.username} ({doc.specialization})</option>
                            ))}
                        </select>
                        <label>Date & Time</label>
                        <input
                            className="input-field"
                            type="datetime-local"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            required
                        />
                        <button className="btn btn-primary" style={{ width: '100%' }}>Confirm Booking</button>
                    </form>
                </div>

                {/* My Appointments Section */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>My Appointments</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {appointments.length === 0 && <p>No appointments found.</p>}
                        {appointments.map(app => (
                            <div key={app._id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <User size={16} /> Dr. {app.doctor.username}
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={14} /> {new Date(app.date).toLocaleString()}
                                    </p>
                                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', backgroundColor: app.status === 'booked' ? '#dcfce7' : '#fee2e2', color: app.status === 'booked' ? '#166534' : '#991b1b' }}>
                                        {app.status}
                                    </span>
                                </div>
                                {app.status === 'booked' && (
                                    <button onClick={() => handleCancel(app._id)} className="btn" style={{ color: 'var(--danger)', backgroundColor: 'transparent' }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;

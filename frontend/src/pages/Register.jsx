import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'patient',
        specialization: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(formData);
            if (data.role === 'patient') navigate('/patient-dashboard');
            else navigate('/doctor-dashboard');
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '450px', marginTop: '50px' }}>
            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>
                <form onSubmit={onSubmit}>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <select
                        className="input-field"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                    {formData.role === 'doctor' && (
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Specialization (e.g. Cardiologist)"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            required
                        />
                    )}
                    <button className="btn btn-primary" style={{ width: '100%' }} type="submit">Register</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

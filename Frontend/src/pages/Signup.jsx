import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import '../styles.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'FARMER',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const roles = [
    { value: 'FARMER', label: '👨‍🌾 Farmer' },
    { value: 'QUALITY_INSPECTOR', label: '🔍 Quality Inspector' },
    { value: 'PROCUREMENT_OFFICER', label: '🛒 Procurement Officer' },
    { value: 'ADMIN', label: '⚙️ Admin' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccess('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role, formData.phoneNumber);
      setSuccess('✅ Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-header">
            <h1>🌾 Agricultural Procurement System</h1>
            <p>Farm Produce Quality Grading &amp; Wholesale Procurement</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2>Create Account</h2>

            {generalError && (
              <div className="error-message"><strong>⚠️ {generalError}</strong></div>
            )}
            {success && (
              <div className="success-message"><strong>{success}</strong></div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className={errors.password ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#27ae60', fontWeight: '600' }}>Sign In</Link>
            </p>
          </form>

          <div className="login-footer">
            <p>© 2026 Agricultural Procurement System | GUVI Hackathon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

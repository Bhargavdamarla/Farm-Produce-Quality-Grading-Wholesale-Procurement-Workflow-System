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
    } else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid @gmail.com address';
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
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
        <div className="login-box" style={{ maxWidth: "550px", width: "100%" }}>
          <div className="login-header" style={{ marginBottom: "1.5rem" }}>
            <h1>🌾 Agricultural Procurement System</h1>
            <p>Farm Produce Quality Grading & Wholesale Procurement</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2 style={{ marginBottom: "1rem" }}>Create Account</h2>

            {generalError && (
              <div className="error-message"><strong>⚠️ {generalError}</strong></div>
            )}
            {success && (
              <div className="success-message"><strong>{success}</strong></div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? 'input-error' : ''}
                  disabled={loading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? 'input-error' : ''}
                  disabled={loading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9999999999"
                maxLength="10"
                inputMode="numeric"
                pattern="\d{10}"
                className={errors.phoneNumber ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className={errors.password ? 'input-error' : ''}
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className={errors.confirmPassword ? 'input-error' : ''}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
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

            <button type="submit" className="btn-login" disabled={loading} style={{ marginTop: "0.5rem" }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className="auth-switch-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

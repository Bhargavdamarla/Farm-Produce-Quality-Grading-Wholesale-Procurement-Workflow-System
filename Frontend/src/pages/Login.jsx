import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import '../styles.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
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

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      onLoginSuccess(user);
      const roleRoutes = {
        FARMER: '/farmer',
        INSPECTOR: '/inspector',
        PROCUREMENT_OFFICER: '/procurement',
        ADMIN: '/admin',
      };
      navigate(roleRoutes[user.role] || '/');
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
            <h2>Sign In</h2>

            {generalError && (
              <div className="error-message"><strong>⚠️ {generalError}</strong></div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
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
              <label htmlFor="password">Password</label>
              <div className="password-input-group">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'input-error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#27ae60', fontWeight: '600' }}>Sign Up</Link>
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

export default Login;

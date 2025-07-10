import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { User, Lock, Mail, Phone, UserPlus, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    email: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password in real-time
    if (name === 'password') {
      const validationError = validatePassword(value);
      setPasswordError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check password validation before submitting
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.register(formData);
      
      // Registration successful - redirect to login
      navigate('/login', { 
        state: { message: 'Registration successful! Please sign in with your credentials.' }
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="card">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <UserPlus className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Register</h2>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="input"
            placeholder="First Name"
          />
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="input"
            placeholder="Last Name"
          />
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="Mobile Number"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="Email"
          />
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="input"
            placeholder="Username"
          />
          <div className="relative mb-4">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input pr-10"
              placeholder="Create Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <Lock className="h-5 w-5 text-gray-400" />
              ) : (
                <Lock className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {passwordError && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <XCircle className="h-4 w-4 mr-1" />
              {passwordError}
            </div>
          )}
          {formData.password && !passwordError && (
            <div className="mt-1 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Password meets all requirements
            </div>
          )}
          {error && (
            <div className="text-red-600 text-sm text-center mb-2">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading || passwordError}
            className="btn-primary"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 
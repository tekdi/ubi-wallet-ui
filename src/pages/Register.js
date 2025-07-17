import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Lock, UserPlus, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return 'Mobile number must be exactly 10 digits';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear any existing messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');

    // Validate password in real-time
    if (name === 'password') {
      const validationError = validatePassword(value);
      setPasswordError(validationError);
      
      // Also validate confirm password when password changes
      if (formData.confirmPassword) {
        const confirmValidation = validateConfirmPassword(formData.confirmPassword);
        setConfirmPasswordError(confirmValidation);
      }
    }

    // Validate phone in real-time
    if (name === 'phone') {
      const validationError = validatePhone(value);
      setPhoneError(validationError);
    }

    // Validate confirm password in real-time
    if (name === 'confirmPassword') {
      const validationError = validateConfirmPassword(value);
      setConfirmPasswordError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing messages
    setError('');
    setSuccess('');

    // Check all validations before submitting
    const passwordValidation = validatePassword(formData.password);
    const phoneValidation = validatePhone(formData.phone);
    const confirmPasswordValidation = validateConfirmPassword(formData.confirmPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }
    
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }
    
    if (confirmPasswordValidation) {
      setConfirmPasswordError(confirmPasswordValidation);
      return;
    }

    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }

    if (confirmPasswordValidation) {
      setConfirmPasswordError(confirmPasswordValidation);
      return;
    }

    setLoading(true);

    try {
      // Create registration data without confirmPassword
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        email: formData.email,
        username: formData.username
      };

      const response = await authApi.register(registrationData);

      if (response.status === 201) {
        // Show success popup
        setShowSuccessPopup(true);
      } else {
        setError('Registration failed. Please try again.');
      }
      
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.response?.data?.message) {
        // Handle array of error messages
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(', ');
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login', { 
      state: { message: 'Registration successful! Please sign in with your credentials.' }
    });
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <XCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
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
          <div className="mb-4">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="Mobile Number (10 digits)"
              maxLength="10"
            />
            {phoneError && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                {phoneError}
              </div>
            )}
          </div>
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
          <div className="relative mb-4">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input pr-10"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              <Lock className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          {confirmPasswordError && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <XCircle className="h-4 w-4 mr-1" />
              {confirmPasswordError}
            </div>
          )}
          {formData.confirmPassword && !confirmPasswordError && (
            <div className="mt-1 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Passwords match
            </div>
          )}
          <button
            type="submit"
            disabled={loading || passwordError || phoneError || confirmPasswordError}
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

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully. You can now log in with your credentials.
              </p>
              <button
                onClick={handleLoginClick}
                className="btn-primary w-full"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register; 
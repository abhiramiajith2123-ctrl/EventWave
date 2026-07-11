import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [formData, setFormData] = useState({
    fullName: '',
    registerNumber: '',
    department: '',
    batch: '',
    yearOfStudy: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const departments = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Botany', 'Microbiology', 'Commerce'
  ];
  const yearsOfStudy = ['First Year', 'Second Year', 'Third Year'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      const payload = { ...formData, role };
      const response = await axios.post('https://eventwave-t6v4.onrender.com/api/auth/register', payload);
      toast.success(response.data.message || 'Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-140px)] py-10 px-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-6">Create Account</h2>
        
        {/* Role Toggle */}
        <div className="flex bg-gray-200/50 p-1 rounded-xl mb-8">
          <button
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
              role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setRole('student')}
            type="button"
          >
            Student
          </button>
          <button
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
              role === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setRole('admin')}
            type="button"
          >
            Administrator
          </button>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
          
          {/* Shared Field for both roles (if needed, but Admin has Email, Student has Register Number. Wait, Admin needs Full Name too based on requirements) */}
          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder=""
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=""
              autoComplete="off"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {role === 'student' ? (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Register Number
                </label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="" disabled>Select Dept</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Year of Study
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="" disabled>Select Year</option>
                    {yearsOfStudy.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Batch
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? "text" : "password"}
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    placeholder=""
                    autoComplete="off"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showSecretKey ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=""
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

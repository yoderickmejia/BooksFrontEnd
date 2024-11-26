import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isDark, setIsDark] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, formData);
    
      const { token } = response.data;

      localStorage.setItem('jwt', token);
      

      const userId = response.data.user._id;
      localStorage.setItem('userId', userId);
      console.log(userId);
     

      navigate('/home');
      console.log('Login exitoso');
    } catch (error) {
      alert('Error al iniciar sesión: ' + error);
    }
  };

  return (
    <Box
      className={`flex w-screen h-screen flex-col justify-center px-6 py-12 lg:px-8 ${
        isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: isDark ? 'gray.700' : 'gray.200',
          color: isDark ? 'yellow' : 'gray.800',
          '&:hover': {
            backgroundColor: isDark ? 'gray.600' : 'gray.300',
          },
        }}
      >
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full text-gray-900 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full text-gray-900 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </Box>
  );
};

export default Login;

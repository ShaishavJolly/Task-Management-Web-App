import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { showToast } from '../components/utils/showToast';

const LoginForm = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
    email: '',
    password: '',
    });
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validateForm()){
    // Add validation logic here to ensure the form data is valid
    try {
        // Send a POST request to your login API endpoint
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const result = await response.json()
        if (response.status === 200) {
          showToast('Login successful', 'success');
          router.push("/tasks")
        }
        if (response.status === 400) {
          setErrors({invalid: 'Invalid Credentials' });
          showToast('Login failed. Please try again.', 'error');
        }
      } catch (error) {
        showToast('Login failed due to server error', 'error');
    }
}
  };

  return (
    <div className="flex flex-col space-y-4 justify-center items-center h-screen w-full bg-gradient-to-br from-sky-50 to-gray-200">
    <div className='flex p-8 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit} className='flex flex-col  bg-white w-80'>
      <h2 className="text-3xl font-bold mx-auto mb-2">Login</h2>
      <p className='text-xl mx-auto text-slate-700 mb-16'>Task Management App</p>
      {errors.invalid && <div className="text-red-600 text-sm mt-1 mx-auto">
      {errors.invalid}</div>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.email && <div className="text-red-600 text-sm mt-1">*{errors.email}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.password && <div className="text-red-600 text-sm mt-1">*{errors.password}</div>}
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Login
        </button>

      </form>
      </div>
        <div className='flex flex-col items-center space-x-2'>
          <p>Or</p><Link href={"/register"} className='text-md text-blue-800'>Create a new Account</Link>
        </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // Check if the user is authenticated
  const isAuthenticated = context.req.cookies.token !== undefined;

  if (isAuthenticated) {
    // Redirect to the login page if not authenticated
    return {
      redirect: {
        destination: '/tasks',
        permanent: false,
      },
    };
  }
  return { props: {isAuthenticated}}
}

export default LoginForm;

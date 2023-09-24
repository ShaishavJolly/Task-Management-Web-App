import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { showToast } from '@/components/utils/showToast';

const RegisterForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password
        })
      })
      const result  = await response.json()
      if(response.ok){
        showToast("Your account has been created","success")
        router.push("/tasks")
      }
      if(response.status === 400){
        showToast("This email is already registered","error")
      }
      } catch (error) {
        showToast("An error occurred","error")
      }
  }
  };

  return (
    <div className="flex flex-col space-y-4 justify-center items-center h-screen w-full bg-gradient-to-br from-sky-50 to-gray-200">
    <div className='flex p-8 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit} className='flex flex-col  bg-white w-80'>
      <h2 className="text-2xl font-bold mx-auto mb-2">Create your account</h2>
      <p className='text-sm mx-auto text-slate-700 mb-8'>Enter your details</p>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"

          />
          {errors.name && <div className="text-red-600 text-sm mt-1">*{errors.name}</div>}
        </div>
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
            autoComplete='on'
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            
          />
          {errors.password && <div className="text-red-600 text-sm mt-1">*{errors.password}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete='on'
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            
          />
      {errors.confirmPassword && <div className="text-red-600 text-sm mt-1">*{errors.confirmPassword}</div>}
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Register
        </button>
      </form>
      </div>
      <div className='flex items-center space-x-2'>
          <p>Already a user?</p><Link href={"/login"} className='text-md text-blue-800'>Log In</Link>
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

export default RegisterForm;

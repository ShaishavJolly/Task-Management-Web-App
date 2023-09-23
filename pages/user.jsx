import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { showToast } from '@/components/utils/showToast';

const UserDetails = () => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({})

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails({...data,password: ''});
      } catch (error) {
        showToast("An error occurred","error")
        router.push("/")
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };
  const validateForm = () => {
    const newErrors = {};

    if (!userDetails.username.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!userDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!userDetails.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (userDetails.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validateForm()){
    try {
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(userDetails),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update user details');
        }
        showToast("Your details are updated","success")
        window.location.reload()
      } catch (error) {
        showToast("An error occurred","error")
      }
    }
  };

  return (
    <div className="container mx-auto py-8 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mb-4">User Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className='flex flex-col p-12 space-y-4'>
          {/* Input fields for user details */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-md font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userDetails.username}
              onChange={handleInputChange}
              className="form-input py-1 px-2 rounded border"
            />
            {errors.name && <div className="text-red-600 text-sm mt-1">*{errors.name}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-md font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              className="form-input py-1 px-2 rounded border"
            />
            {errors.email && <div className="text-red-600 text-sm mt-1">*{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-md font-bold mb-2">
              Create new Password
            </label>
            <input
              type="pasword"
              id="password"
              name="password"
              value={userDetails.password}
              onChange={handleInputChange}
              className="form-input py-1 px-2 rounded border"
            />
            {errors.password && <div className="text-red-600 text-sm mt-1">*{errors.password}</div>}
          </div>
          <div className="mt-4">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className='flex flex-col p-12 space-y-4'>
          <div className='mb-4'>
            <div className='text-gray-700 text-md font-bold mb-2'>Username</div> 
            <div className='py-1 px-2'>{userDetails.username}</div>
          </div>
          <div className='mb-4'>
            <div className='text-gray-700 text-md font-bold mb-2'>Email:</div>
            <div className='py-1 px-2'>{userDetails.email}</div>
          </div>
          <div className="mb-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
          >
            Edit
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

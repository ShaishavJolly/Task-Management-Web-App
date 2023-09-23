import { showToast } from '@/components/utils/showToast';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const edittask = () => {
  const router  = useRouter()
  const {taskid} = router.query
  const [errors, setErrors] = useState({})
  const [updatedTask, setUpdatedTask] = useState({
      name: '',
      desc: '',
      progress: 'To Do',
      dueDate: '',
      tags: ''
    });
  useEffect(() => {
  if(router.isReady){
    const fetchTask = async ()=>{
      try { 
        const response = await fetch(`http://localhost:5000/api/tasks/${taskid}`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if(!response.ok){
            throw new Error('task not fetched')
        }
        const data = await response.json()   
        const formattedDueDate = new Date(data.dueDate).toISOString().split('T')[0];
        const tagsString = data.tags.join(',')
        setUpdatedTask({...data,dueDate: formattedDueDate,tags: tagsString})
      } catch (error) {
          showToast("An error occured","error")
      }
    }
    fetchTask()
}},[router.isReady,taskid])
      
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({
      ...updatedTask,
      [name]: value,
    });
  };
    
  const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Submit the updatedTask data along with taskId to your server for updating the task
        const validationErrors = {};

    // Validate required fields
    if (!updatedTask.name.trim()) {
      validationErrors.name = 'Task name is required';
    }

    // Validate input length (example: description should be between 10 and 100 characters)
    if (updatedTask.desc.length < 10 || updatedTask.desc.length > 100) {
      validationErrors.description = 'Description must be between 10 and 100 characters';
    }

    // Validate Due Date
      // Parse the due date string to a Date object
      const dueDate = new Date(updatedTask.dueDate);

      // Check if the due date is in the past
      if (dueDate < new Date()) {
        validationErrors.dueDate = 'Due date must be in the future';
      }

    // Check if the progress is "Completed"
    if (updatedTask.progress === 'Completed') {
      // Capture the current date and time as the completion date
      updatedTask.completionDate = new Date();
    } else {
      // If progress is not "Completed," set completionDate to null
      updatedTask.completionDate = null;
    }

    let tagsArray = []
    if(updatedTask.tags !== ""){
      tagsArray = updatedTask.tags.split(',').map((tag) => tag.trim())
    }

    const newTask = {
      ...updatedTask,
      tags: tagsArray
    }

    // Check if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

        try {
          const response = await fetch(`http://localhost:5000/api/tasks/${taskid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(newTask),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update task');
          }
          showToast("Saved Changes","success")
          router.push(`/task/${taskid}`)
        } catch (error) {
          showToast("An error occurred","error")
          router.push("/")
        }
  };
  return (
    <>
    <div className="mx-8">
      <form onSubmit={handleFormSubmit} className='flex flex-col'>
      <h2 className="text-2xl font-semibold my-8 mx-auto">Edit Task</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Task Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedTask.name}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.name && <div className="error text-sm text-red-700">*{errors.name}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="desc"
            value={updatedTask.desc}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="4"
          ></textarea>
          {errors.description && <div className="error text-sm text-red-700">*{errors.description}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700">Progress</label>
          <select
            id="progress"
            name="progress"
            value={updatedTask.progress}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={updatedTask.dueDate}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.dueDate && <div className="error text-sm text-red-700">*{errors.dueDate}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={updatedTask.tags}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md bg-gray-100 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          Save Changes
        </button>
      </form>
    </div>
    </>
  )
}

export async function getServerSideProps(context) {
  // Check if the user is authenticated
  const isAuthenticated = context.req.cookies.token !== undefined;

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {}}
}

export default edittask
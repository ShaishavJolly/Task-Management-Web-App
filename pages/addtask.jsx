import { showToast } from '@/components/utils/showToast'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const addtask = () => {
  const router  = useRouter()
  const [taskInfo, setTaskInfo] = useState({name: "", desc: "",dueDate: "",progress: 'To Do',tags: ""})
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e)=>{
    e.preventDefault()

    const validationErrors = {};

    // Validate required fields
    if (!taskInfo.name.trim()) {
      validationErrors.name = 'Task name is required';
    }

    // Validate input length (example: description should be between 10 and 100 characters)
    if (taskInfo.desc.length < 10 || taskInfo.desc.length > 100) {
      validationErrors.description = 'Description must be between 10 and 100 characters';
    }

    // Validate Due Date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(taskInfo.dueDate)) {
      validationErrors.dueDate = 'Due date must be in the format YYYY-MM-DD';
    } else {
      // Parse the due date string to a Date object
      const dueDate = new Date(taskInfo.dueDate);

    // Check if the progress is "Completed"
    if (taskInfo.progress === 'Completed') {
      // Capture the current date and time as the completion date
      taskInfo.completionDate = new Date();
    } else {
      // If progress is not "Completed," set completionDate to null
      taskInfo.completionDate = null;
    }

    // Check if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    let tagsArray = []
    if(taskInfo.tags !== ""){
      tagsArray = taskInfo.tags.split(',').map((tag) => tag.trim())
    }

    const newTask = {
      ...taskInfo,
      tags: tagsArray
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newTask),
      });
      if(response.ok){
        const result = await response.json();
        showToast("Task added","info")
        router.push("/tasks")
      }
    } catch (error) {
      showToast("Some error occurred","error")
      router.push("/")
    }
  }
}
  const handleChange = (e)=>{
    setTaskInfo({...taskInfo,[e.target.name]:e.target.value})
  }
  return (
    <>
      <form onSubmit={handleSubmit} className='w-11/12 mx-auto p-8'>
      <div className="mb-4">
        <label htmlFor="taskName" className="block text-gray-700 font-semibold">
          Task Name:
        </label>
        <input
          type="text"
          name="name"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Enter task name"
          required
          value={taskInfo.name}
          onChange={handleChange}
        />
        {errors.name && <div className="error text-sm text-red-700">*{errors.name}</div>}
      </div>
      <div className="mb-4">
        <label
          htmlFor="taskDescription"
          className="block text-gray-700 font-semibold"
        >
          Description:
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Enter task description"
          rows="10"
          required
          name='desc'
          value={taskInfo.desc}
          onChange={handleChange}
        />
        {errors.description && <div className="error text-sm text-red-700">*{errors.description}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-gray-700 font-semibold">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          name="dueDate"
          required
          value={taskInfo.dueDate}
          onChange={handleChange}
        />
        {errors.dueDate && <div className="error text-sm text-red-700">*{errors.dueDate}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="progress" className="block text-gray-700 font-semibold">Progress:</label>
        <select
          id="progress"
          name="progress"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          value={taskInfo.progress}
          onChange={handleChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="block text-gray-700 font-semibold">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          name="tags"
          value={taskInfo.tags}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600">Add Task
      </button>
    </form>
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
    }
  }
    return { props: {}}

}

export default addtask
import TaskCard from '@/components/TaskCard';
import Error from '@/components/error';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { showToast } from '@/components/utils/showToast';

const tasks = () => {
  const router = useRouter()
  const [tasks, settasks] = useState([])
  const [error, seterror] = useState(null)
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const fetchTasks = async()=>{
        try {
        const response = await fetch(`http://localhost:5000/api/tasks`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if(!response.ok){
          throw new Error("Failed to fetch tasks")
        }
        const fetchedData = await response.json()
        settasks(fetchedData)
        setLoading(false);
      } catch (error) {
        seterror(error.message)
        setLoading(false);
      }
    }
      fetchTasks()
  },[])
  const deleteTasks = async (taskId)=>{
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
      if(response.ok){
        const result = await response.json();
        showToast("Task deleted")
      }
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      settasks(updatedTasks);
    } catch (error) {
      showToast(error.message,"error")
      seterror(error.message)
    }
  }

  if (error) {
    return (
      <Error message={error} route={router.pathname} />
    );
  }
  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
    {tasks.length === 0 ? (
        <div className="mx-auto my-8 text-center text-gray-500">
          No tasks created! Add some tasks
        </div>
      ) : 
        (<div className="mx-20 my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            id = {task._id}
            name={task.name}
            description={task.desc}
            progress={task.progress}
            tags = {task.tags}
            onDelete={()=>{deleteTasks(task._id)}}
          />
        ))}
      </div>)}
      {error && (
        <div className="mx-20 mt-4 text-red-600">{error}</div>
      )}
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

export default tasks
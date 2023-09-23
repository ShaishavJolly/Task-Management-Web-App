import { showToast } from '@/components/utils/showToast'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const taskDetails = () => {
    const router = useRouter()
    const {slug} = router.query
    
    const [task, settask] = useState({name: '', desc: '', dueDate: null, completionDate: null, progress: '', tags: []})
    
    useEffect(() => {
        try { 
            if(router.isReady){
                const fetchTask = async ()=>{
                    const response = await fetch(`http://localhost:5000/api/tasks/${slug}`, {
                      method: "GET",
                      credentials: 'include'
                    })
                    if(!response.ok){
                        throw new Error('task not fetched')
                    }
                    const data = await response.json()   
                    settask(data)
                }
                fetchTask()
            }
        } catch (error) {
            showToast("An error occurred","error")
            router.push("/")
        }
    }, [router.isReady,slug])
    const { name, desc, dueDate, completionDate, progress, tags } = task;

    const formattedDueDate = new Date(dueDate).toLocaleDateString()
  return (
    <>
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">{name}</h1>
      
      <div className="mb-4">
        <strong>Description:</strong>
        <p className="mt-2">{desc}</p>
      </div>
      
      <div className="mb-4">
        <strong>Due Date:</strong>
        <p className="mt-2">{formattedDueDate}</p>
      </div>
      
      <div className="mb-4">
        <strong>Completion Date:</strong>
        <p className="mt-2">{completionDate ? completionDate : 'Not completed yet'}</p>
      </div>
      
      <div className="mb-4">
        <strong>Progress:</strong>
        <p className={`mt-2 ${progress === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
          {progress}
        </p>
      </div>
      
      <div className="mb-4">
        <strong>Tags:</strong>
        <div className="flex flex-wrap mt-2">
          {tags.map((tag, index) => {
            return <span key={index} className="bg-gray-200 px-2 py-1 rounded-md mr-2 mb-2">
              {tag}
            </span>
          })}
        </div>
      </div>
      
      <button onClick={()=>{router.push(`/edittask/${slug}`)}} className="text-white bg-blue-800 hover:bg-blue-950 rounded-md text-sm p-2 mx-2">
        Edit Task
      </button>
      <button onClick={()=>{router.push('/tasks')}} className="text-white bg-blue-800 hover:bg-blue-950 rounded-md text-sm p-2 mx-2">
        Back to Task List
      </button>
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
  return { props: {isAuthenticated}}
}

export default taskDetails
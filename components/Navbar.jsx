import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { showToast } from '../components/utils/showToast';
import jwtDecode from 'jwt-decode'
import {MdAccountCircle} from 'react-icons/md'

const Navbar = () => {
  const token = Cookies.get("token")
  const isAuthenticated = token !== undefined
  if(isAuthenticated){
    var decodedToken = jwtDecode(token)
    var username = decodedToken.user.name
  }
  
  const router = useRouter()

  const handleLogout = async ()=>{
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout",{
        method: "POST",
        credentials: "include"
      })
      const result = await response.json()
      if(response.ok){
        showToast("Logged out successfully","success")
        router.push('/login')
      }

    } catch (error) {
      showToast("An error occured","error")
    }
  }
  return (
    <nav className="bg-blue-500 p-4 shadow-lg sticky">
      <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link href="/" className="text-white text-2xl font-semibold">Task Manager</Link>
          </div>
          <ul className="flex space-x-6">
            <li>
            <Link href="/tasks" className="text-white hover:underline hover:underline-offset-8">Tasks</Link>
            </li>
            <li>
            <Link href="/addtask" className="text-white hover:underline hover:underline-offset-8">Add Task</Link>
            </li>
          </ul>
          <div className='flex justify-center items-center space-x-4'>
            {isAuthenticated && <div className='text-white flex items-center text-xl'><Link href={"/user"}><MdAccountCircle className='text-3xl mx-2' /></Link>{username}</div>}
            {
              isAuthenticated && <button onClick={handleLogout} className='text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50'>Logout</button>
            }
          </div>
        </div>
    </nav>
  )
}

export default dynamic (() => Promise.resolve(Navbar), {ssr: false})

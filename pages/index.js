import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Cookies from 'js-cookie'


export default function Home() {
  const router = useRouter()
  const token = Cookies.get("token")
  const isAuthenticated = token !== undefined

  useEffect(()=>{
    if(isAuthenticated){
      router.push('/tasks')
    }
    else{
      router.push('/login')
    }
  },[])
  return (
    <>
    </>
  )
}

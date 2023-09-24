import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home({isAuthenticated}) {
  const router = useRouter()
  useEffect(()=>{
    if(!isAuthenticated){
      router.push('/login')
      console.log('if')
    }
    else{
      router.push('/tasks')
      console.log('else')
    }
  },[router.query])
  return (
    <>
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

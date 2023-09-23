import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const isAuthenticated = Cookies.get('token') !== undefined;
    if (!isAuthenticated && router.pathname === '/') {
      router.push('/login');
    }
    // Check if the current route is '/login' or '/register'
    if (router.pathname === '/login' || router.pathname === '/register') {
      // Hide Navbar on these pages
      setShowNavbar(false);
    } else {
      // Show Navbar on other pages
      setShowNavbar(true);
    }

  }, [router.pathname]);
  return (
    <>
    <Head>
      <title>Task Management App</title>
    </Head>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>)
}

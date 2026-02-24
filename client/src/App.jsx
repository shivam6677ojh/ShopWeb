import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct'
// import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from './components/CartMobile';
import Preloader from './components/Preloader';

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true);
  const MIN_LOADER_MS = 1500;


  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }


  useEffect(() => {
    const initApp = async () => {
      const startTime = Date.now();
      try {
        await Promise.all([
          fetchUser(),
          fetchCategory(),
          fetchSubCategory()
        ]);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(MIN_LOADER_MS - elapsed, 0);
        setTimeout(() => setIsLoading(false), remaining);
      }
    };
    initApp();
    // fetchCartItem()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      {isLoading && <Preloader />}
      <Header />
      <main className='min-h-[78vh] bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname !== '/checkout' && (
          <CartMobileLink />
        )
      }
    </>
  )
}

export default App

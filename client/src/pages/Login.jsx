import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
// import loginImage from '../assets/login-image.jpg'

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: "",
                    password: "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-primary-dark'>
            {/* Left Side - Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='hidden lg:block relative overflow-hidden'
            >
                <div className='absolute inset-0 bg-black/30 z-10' />
                <div className='absolute inset-0 flex flex-col justify-center items-center z-20 text-white p-12 text-center'>
                    <h2 className='text-5xl font-serif font-bold mb-6'>Welcome Back</h2>
                    <p className='text-lg font-light max-w-md'>Sign in to access your curated collection of luxury essentials and exclusive offers.</p>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" // Temporary placeholder URL or use local asset
                    alt="Luxury Shopping"
                    className='w-full h-full object-cover'
                />
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='flex items-center justify-center p-8 lg:p-16 relative bg-primary-light dark:bg-primary-dark'
            >
                <div className='w-full max-w-md space-y-8'>
                    <div className='text-center lg:text-left'>
                        <h1 className='text-4xl font-serif font-bold text-luxury-dark dark:text-luxury-cream mb-2'>Sign In</h1>
                        <p className='text-gray-500 dark:text-gray-400'>Please enter your details to continue.</p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div className='space-y-2'>
                            <label htmlFor='email' className='text-sm font-medium text-luxury-dark dark:text-luxury-cream'>Email Address</label>
                            <input
                                type='email'
                                id='email'
                                className='w-full px-4 py-3 rounded-lg border border-luxury-gold/30 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                placeholder='you@example.com'
                            />
                        </div>
                        <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                                <label htmlFor='password' className='text-sm font-medium text-luxury-dark dark:text-luxury-cream'>Password</label>
                                <Link to={"/forgot-password"} className='text-sm text-luxury-gold hover:text-luxury-gold-hover transition-colors'>Forgot password?</Link>
                            </div>
                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className='w-full px-4 py-3 rounded-lg border border-luxury-gold/30 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 transition-all pr-12'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder='••••••••'
                                />
                                <div
                                    onClick={() => setShowPassword(preve => !preve)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-luxury-gold transition-colors'
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!valideValue}
                            className={`${valideValue ? "bg-luxury-gold hover:bg-luxury-gold-hover shadow-lg shadow-luxury-gold/20" : "bg-gray-400 cursor-not-allowed"} w-full py-3.5 rounded-lg text-white font-serif font-medium tracking-wide transition-all duration-300`}
                        >
                            Sign In
                        </motion.button>
                    </form>

                    <div className='text-center border-t border-luxury-gold/10 pt-6'>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Don't have an account? <Link to={"/register"} className='font-serif font-bold text-luxury-gold hover:text-luxury-gold-hover transition-colors'>Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Login


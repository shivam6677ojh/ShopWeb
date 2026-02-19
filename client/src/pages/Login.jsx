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


    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }



    }
    return (
        <section className='relative w-full min-h-[80vh] px-4 py-10 bg-blue-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 overflow-hidden'>
            <div className='absolute -top-24 -left-16 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl rounded-full' />
            <div className='absolute -bottom-28 -right-10 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-400/20 blur-3xl rounded-full' />

            <div className='relative w-full max-w-lg mx-auto my-6 rounded-2xl border border-slate-200 bg-white/90 dark:border-white/10 dark:bg-slate-900/80 p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]'>
                <div className='mb-3'>
                    <h1 className='text-2xl font-semibold tracking-wide text-slate-800 dark:text-white'>Welcome back</h1>
                    <p className='text-sm text-slate-500 dark:text-slate-300'>Sign in to continue your cart and offers.</p>
                </div>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email' className='text-slate-700 dark:text-slate-200'>Email</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-white text-slate-800 p-2 border border-slate-200 rounded outline-none focus:border-emerald-400 placeholder:text-slate-400 dark:bg-slate-950/80 dark:text-slate-100 dark:border-white/10 dark:focus:border-emerald-300 dark:placeholder:text-slate-500'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='you@example.com'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='password' className='text-slate-700 dark:text-slate-200'>Password</label>
                        <div className='bg-white text-slate-800 p-2 border border-slate-200 rounded flex items-center focus-within:border-emerald-400 dark:bg-slate-950/80 dark:text-slate-100 dark:border-white/10 dark:focus-within:border-emerald-300'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'>Forgot password?</Link>
                    </div>
    
                    <button
                        disabled={!valideValue}
                        className={`${valideValue ? "bg-emerald-500 hover:bg-emerald-400" : "bg-slate-700"} text-slate-950 py-2 rounded font-semibold my-3 tracking-wide transition-colors`}
                    >
                        Login
                    </button>
                </form>

                <p className='text-slate-600 dark:text-slate-300'>
                    Don't have account? <Link to={"/register"} className='font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login


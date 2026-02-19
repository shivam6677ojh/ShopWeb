import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser, FaMoon, FaSun } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty, theme, toggleTheme } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white/80 dark:bg-primary-dark/90 backdrop-blur-md shadow-sm dark:shadow-white/5 border-b border-luxury-gold/10'
        >
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center px-4 justify-between'>
                        {/**logo */}
                        <div className='h-full mt-2'>
                            <Link to={"/"} className='h-full flex justify-center items-center'>
                                <img
                                    src={logo}
                                    width={200}
                                    height={10}
                                    alt='logo'
                                    className='hidden lg:block'
                                />
                                <img
                                    src={logo}
                                    width={170}
                                    height={60}
                                    alt='logo'
                                    className='lg:hidden'
                                />
                            </Link>
                        </div>

                        {/**Search */}
                        <div className='hidden lg:block flex-1 max-w-lg mx-8'>
                            <Search />
                        </div>


                        {/**login and my cart */}
                        <div className=''>
                            {/**user icons display in only mobile version**/}
                            <div className='flex items-center gap-4 lg:hidden'>
                                <button className='text-luxury-dark dark:text-luxury-cream hover:text-luxury-gold transition-colors' onClick={handleMobileUser}>
                                    <FaRegCircleUser size={26} />
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className='p-2 rounded-full border border-luxury-gold/20 text-luxury-dark dark:text-luxury-cream hover:bg-luxury-gold/10 transition-colors'
                                    aria-label='Toggle theme'
                                >
                                    {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
                                </button>
                            </div>

                            {/**Desktop**/}
                            <div className='hidden lg:flex items-center gap-8'>
                                <button
                                    onClick={toggleTheme}
                                    className='p-2 rounded-full border border-luxury-gold/20 text-luxury-dark dark:text-luxury-cream hover:bg-luxury-gold/10 transition-colors'
                                    aria-label='Toggle theme'
                                >
                                    {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                                </button>
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-2 cursor-pointer text-luxury-dark dark:text-luxury-cream hover:text-luxury-gold transition-colors font-medium'>
                                                <p>Account</p>
                                                <motion.div
                                                    animate={{ rotate: openUserMenu ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <GoTriangleDown size={20} />
                                                </motion.div>

                                            </div>
                                            <AnimatePresence>
                                                {
                                                    openUserMenu && (
                                                        <div className='absolute right-0 top-12 z-50'>
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 10 }}
                                                                className='bg-white dark:bg-secondary-dark dark:text-luxury-cream rounded-xl p-4 min-w-52 shadow-xl border border-luxury-gold/10 backdrop-blur-sm'
                                                            >
                                                                <UserMenu close={handleCloseUserMenu} />
                                                            </motion.div>
                                                        </div>
                                                    )
                                                }
                                            </AnimatePresence>

                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={redirectToLoginPage}
                                            className='text-lg px-6 py-2 rounded-full font-serif font-medium text-luxury-dark dark:text-luxury-cream hover:bg-luxury-gold/10 transition-colors'
                                        >
                                            Login
                                        </motion.button>
                                    )
                                }
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setOpenCartSection(true)}
                                    className='flex items-center gap-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-hover hover:to-luxury-gold px-5 py-2.5 rounded-full text-white shadow-lg shadow-luxury-gold/20 group'
                                >
                                    {/**add to card icons */}
                                    <div className='group-hover:animate-bounce'>
                                        <BsCart4 size={22} />
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        {
                                            cartItem[0] ? (
                                                <div className='flex flex-col items-start leading-tight'>
                                                    <p className='text-xs opacity-90'>{totalQty} Items</p>
                                                    <p className='text-sm font-bold'>{DisplayPriceInRupees(totalPrice)}</p>
                                                </div>
                                            ) : (
                                                <p>My Cart</p>
                                            )
                                        }
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className='container mx-auto px-4 lg:hidden pb-2'>
                <Search />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }
        </motion.header>
    )
}

export default Header

import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) {
                close()
            }
            return
        }
        toast("Please Login")
    }
    return (
        <section className='bg-black/50 fixed inset-0 z-50 backdrop-blur-sm'>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className='bg-white dark:bg-primary-dark w-full max-w-sm min-h-screen max-h-screen ml-auto shadow-2xl flex flex-col'
            >
                <div className='flex items-center p-5 shadow-sm gap-3 justify-between border-b border-luxury-gold/10 bg-white dark:bg-primary-dark z-10'>
                    <h2 className='font-serif font-bold text-xl text-gray-900 dark:text-white'>Shopping Cart ({totalQty})</h2>
                    <button onClick={close} className='text-gray-400 hover:text-luxury-gold transition-colors p-1 rounded-full hover:bg-luxury-gold/10'>
                        <IoClose size={24} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-luxury-gold/20 scrollbar-track-transparent'>
                    {/***display items */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between px-4 py-3 bg-luxury-gold/5 text-luxury-gold rounded-xl border border-luxury-gold/20'>
                                    <p className='font-medium text-sm'>Total Savings</p>
                                    <p className='font-bold text-lg'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                                </div>

                                <div className='space-y-4'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                return (
                                                    <div key={item?._id + "cartItemDisplay"} className='flex gap-3 p-3 bg-white dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-luxury-gold/30 transition-all'>
                                                        <div className='w-20 h-20 min-h-[5rem] min-w-[5rem] bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden p-2'>
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className='object-contain w-full h-full'
                                                                alt={item?.productId?.name}
                                                            />
                                                        </div>
                                                        <div className='flex-1 min-w-0 flex flex-col justify-between'>
                                                            <div>
                                                                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>{item?.productId?.name}</p>
                                                                <p className='text-xs text-gray-500 dark:text-gray-400'>{item?.productId?.unit}</p>
                                                            </div>
                                                            <div className='flex items-center justify-between mt-2'>
                                                                <p className='font-serif font-bold text-luxury-gold'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                                                <div className='scale-75 origin-right'>
                                                                    <AddToCartButton data={item?.productId} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>

                                <div className='bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700'>
                                    <h3 className='font-serif font-semibold text-gray-900 dark:text-white mb-3'>Bill Details</h3>
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                                            <p>Subtotal</p>
                                            <p>{DisplayPriceInRupees(notDiscountTotalPrice)}</p>
                                        </div>
                                        <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                                            <p>Discount</p>
                                            <p className='text-green-600'>-{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                                        </div>
                                        <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                                            <p>Delivery</p>
                                            <p className='text-green-600'>Free</p>
                                        </div>
                                        <div className='pt-3 border-t border-gray-200 dark:border-slate-700 mt-2 flex justify-between items-center'>
                                            <p className='font-bold text-gray-900 dark:text-white'>Total</p>
                                            <p className='font-bold text-xl text-luxury-gold'>{DisplayPriceInRupees(totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='flex flex-col justify-center items-center h-full text-center p-8'>
                                <div className='w-40 h-40 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6'>
                                    <img
                                        src={imageEmpty}
                                        className='w-24 h-24 object-contain opacity-50'
                                        alt="Empty Cart"
                                    />
                                </div>
                                <h3 className='text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2'>Your cart is empty</h3>
                                <p className='text-gray-500 dark:text-gray-400 mb-8 max-w-[200px]'>Looks like you haven't added anything to your cart yet.</p>
                                <button onClick={close} className='px-8 py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-white rounded-full font-medium transition-all shadow-lg shadow-luxury-gold/20'>
                                    Start Shopping
                                </button>
                            </div>
                        )
                    }
                </div>

                {
                    cartItem[0] && (
                        <div className='p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-primary-dark'>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={redirectToCheckoutPage}
                                className='w-full bg-luxury-gold hover:bg-luxury-gold-hover text-white py-4 rounded-xl flex items-center justify-between px-6 shadow-lg shadow-luxury-gold/20 transition-all font-medium'
                            >
                                <span className='font-serif font-bold text-lg'>{DisplayPriceInRupees(totalPrice)}</span>
                                <span className='flex items-center gap-2'>
                                    Proceed to Checkout <FaCaretRight />
                                </span>
                            </motion.button>
                        </div>
                    )
                }
            </motion.div>
        </section>
    )
}

DisplayCartItem.propTypes = {
    close: PropTypes.func
}

export default DisplayCartItem

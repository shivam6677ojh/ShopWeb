import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useDispatch, useSelector } from 'react-redux'
import { addCartItemOptimistic } from '../store/cartProduct'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { motion } from 'framer-motion';

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const dispatch = useDispatch()
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (data?._id) {
            dispatch(addCartItemOptimistic({ product: data, quantity: 1 }))
        }

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
            if (fetchCartItem) {
                fetchCartItem()
            }
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        if (!data?._id || !Array.isArray(cartItem)) {
            setIsAvailableCart(false)
            setQty(0)
            setCartItemsDetails(undefined)
            return
        }

        const checkingitem = cartItem.some(item => item?.productId?._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item?.productId?._id === data._id)
        setQty(product?.quantity || 0)
        setCartItemsDetails(product)
    }, [data?._id, cartItem])


    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)

            if (response.success) {
                toast.success("Item remove")
            }
        }
    }
    return (
        <div className='w-full max-w-[150px]'>
            {
                isAvailableCart ? (
                    <div className='flex w-full h-full bg-luxury-gold/10 rounded overflow-hidden border border-luxury-gold/20'>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={decreaseQty}
                            className='bg-luxury-gold hover:bg-luxury-gold-hover text-white flex-1 w-full p-1 flex items-center justify-center transition-colors'
                        >
                            <FaMinus size={12} />
                        </motion.button>

                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center text-luxury-dark dark:text-luxury-cream'>{qty}</p>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={increaseQty}
                            className='bg-luxury-gold hover:bg-luxury-gold-hover text-white flex-1 w-full p-1 flex items-center justify-center transition-colors'
                        >
                            <FaPlus size={12} />
                        </motion.button>
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleADDTocart}
                        className='relative overflow-hidden w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-hover hover:to-luxury-gold text-white px-2 lg:px-4 py-1.5 rounded shadow-md group'
                    >
                        {/* Shine effect */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />

                        <span className="relative z-10 font-medium tracking-wide">
                            {loading ? <Loading /> : "Add to Cart"}
                        </span>
                    </motion.button>
                )
            }

        </div>
    )
}

export default AddToCartButton

import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    try {
      if (!cartItemsList?.length) {
        toast.error("Your cart is empty")
        return
      }
      if (!addressList?.length || !addressList[selectAddress]?._id) {
        toast.error("Please select an address")
        return
      }

      const toastId = toast.loading("Redirecting to payment...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (!responseData?.id) {
        toast.dismiss(toastId)
        toast.error("Unable to start payment session")
        return
      }

      const { error } = await stripePromise.redirectToCheckout({ sessionId: responseData.id })
      if (error) {
        toast.dismiss(toastId)
        toast.error(error.message || "Payment redirect failed")
        return
      }

      if (fetchCartItem) {
        fetchCartItem()
      }
      if (fetchOrder) {
        fetchOrder()
      }
    } catch (error) {
      toast.dismiss()
      AxiosToastError(error)
    }
  }
  return (
    <section className='bg-primary-light dark:bg-primary-dark min-h-screen py-10'>
      <div className='container mx-auto px-4 lg:px-12'>
        <h1 className='text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8'>Checkout</h1>

        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Left Column: Address Selection */}
          <div className='w-full lg:w-2/3 space-y-6'>
            <div>
              <h3 className='text-xl font-serif font-semibold text-gray-900 dark:text-white mb-4'>Shipping Address</h3>
              <div className='grid gap-4 md:grid-cols-2'>
                {
                  addressList.map((address, index) => {
                    return (
                      <motion.label
                        whileHover={{ scale: 1.01 }}
                        key={index}
                        htmlFor={"address" + index}
                        className={`cursor-pointer relative overflow-hidden rounded-xl border-2 p-4 transition-all ${selectAddress == index ? 'border-luxury-gold bg-luxury-gold/5 dark:bg-luxury-gold/10' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                      >
                        <div className='flex items-start gap-3'>
                          <div className='mt-1'>
                            <input
                              id={"address" + index}
                              type='radio'
                              value={index}
                              onChange={(e) => setSelectAddress(e.target.value)}
                              name='address'
                              className='accent-luxury-gold w-4 h-4'
                            />
                          </div>
                          <div className='space-y-1 text-sm'>
                            <div className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
                              <FaMapMarkerAlt className='text-luxury-gold' />
                              <p>Address {index + 1}</p>
                            </div>
                            <p className='text-gray-600 dark:text-gray-300'>{address.address_line}</p>
                            <p className='text-gray-600 dark:text-gray-300'>{address.city}, {address.state}</p>
                            <p className='text-gray-600 dark:text-gray-300'>{address.country} - {address.pincode}</p>
                            <p className='text-gray-600 dark:text-gray-300'>Phone: {address.mobile}</p>
                          </div>
                        </div>
                      </motion.label>
                    )
                  })
                }
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpenAddress(true)}
                  className='min-h-[160px] rounded-xl border-2 border-dashed border-luxury-gold/30 flex flex-col justify-center items-center cursor-pointer hover:bg-luxury-gold/5 hover:border-luxury-gold transition-all group'
                >
                  <div className='w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors mb-2'>
                    <FaPlus />
                  </div>
                  <p className='text-luxury-gold font-medium'>Add New Address</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className='w-full lg:w-1/3'>
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-luxury-gold/10 p-6 sticky top-24'>
              <h3 className='text-xl font-serif font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-slate-700'>Order Summary</h3>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between text-gray-600 dark:text-gray-300'>
                  <p>Items Total</p>
                  <div className='flex items-center gap-2'>
                    <span className='line-through text-gray-400 text-sm'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{DisplayPriceInRupees(totalPrice)}</span>
                  </div>
                </div>
                <div className='flex justify-between text-gray-600 dark:text-gray-300'>
                  <p>Quantity</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{totalQty} Items</p>
                </div>
                <div className='flex justify-between text-gray-600 dark:text-gray-300'>
                  <p>Delivery Charge</p>
                  <p className='text-green-600 font-medium'>Free</p>
                </div>
              </div>

              <div className='border-t border-b border-gray-100 dark:border-slate-700 py-4 mb-6'>
                <div className='flex justify-between items-center'>
                  <p className='font-bold text-lg text-gray-900 dark:text-white'>Grand Total</p>
                  <p className='font-bold text-2xl text-luxury-gold'>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
                <p className='text-xs text-gray-500 mt-1 text-right'>Incoming taxes included</p>
              </div>

              <div className='space-y-3'>
                <button
                  className='w-full py-4 bg-luxury-gold hover:bg-luxury-gold-hover text-white rounded-xl font-semibold tracking-wide shadow-lg shadow-luxury-gold/20 transition-all'
                  onClick={handleOnlinePayment}
                >
                  Pay Online
                </button>
                <button
                  className='w-full py-4 border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-xl font-semibold tracking-wide transition-all'
                  onClick={handleCashOnDelivery}
                >
                  Cash on Delivery
                </button>
              </div>

              <div className='mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm'>
                <span className='w-full h-[1px] bg-gray-200 dark:bg-slate-700'></span>
                <span className='whitespace-nowrap'>Secure Checkout</span>
                <span className='w-full h-[1px] bg-gray-200 dark:bg-slate-700'></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage

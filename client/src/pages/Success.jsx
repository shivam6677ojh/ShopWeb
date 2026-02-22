import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Success = () => {
  const location = useLocation()
  const title = location?.state?.text ? location.state.text : "Payment"

  return (
  <section className='min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-green-50 via-white to-emerald-50 px-4'>
    <div className='w-full max-w-lg rounded-3xl border border-green-200 bg-white shadow-2xl shadow-green-200/40 p-6 sm:p-8 text-center'>
      <div className='mx-auto mb-5 h-20 w-20 rounded-full bg-green-600/10 flex items-center justify-center'>
        <div className='h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl'>
          ✓
        </div>
      </div>
      <p className='text-xs uppercase tracking-[0.35em] text-green-600'>Payment Received</p>
      <h1 className='mt-2 text-2xl sm:text-3xl font-bold text-gray-900'>
        {title} Successful
      </h1>
      <p className='mt-3 text-sm text-gray-600'>
        Your payment is confirmed and your order is now being processed.
        We will notify you as soon as it is ready for dispatch.
      </p>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <Link
          to="/dashboard/myorders"
          className='py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors'
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className='py-3 rounded-xl border border-green-200 text-green-700 font-semibold hover:bg-green-50 transition-colors'
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  </section>
  )
}

export default Success

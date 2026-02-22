import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const { fetchOrder } = useGlobalContext()
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
  }, [orders])

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        setLoading(true)
        await fetchOrder()
        if (isMounted) {
          setLastUpdated(new Date())
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    const intervalId = setInterval(() => {
      fetchOrder().then(() => {
        if (isMounted) {
          setLastUpdated(new Date())
        }
      })
    }, 15000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [fetchOrder])

  return (
    <section className='bg-white dark:bg-slate-950 min-h-[75vh]'>
      <div className='bg-white dark:bg-slate-950 shadow-sm p-4 border-b border-gray-100 dark:border-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>My Orders</h1>
          <p className='text-xs text-gray-500 dark:text-slate-400'>Auto-refreshes every 15 seconds</p>
        </div>
        <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400'>
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button
            onClick={fetchOrder}
            className='px-3 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors'
          >
            Refresh
          </button>
        </div>
      </div>

      <div className='p-4'>
        {!loading && !sortedOrders[0] && (
          <NoData />
        )}

        <div className='grid gap-4'>
          {sortedOrders.map((order, index) => {
            const orderTotal = Number(order?.totalAmt)
            const paymentStatus = order?.payment_status || "Payment Pending"

            return (
              <div key={order?._id + index + "order"} className='rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 p-4 shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                  <div>
                    <p className='text-xs uppercase tracking-[0.25em] text-gray-400'>Order</p>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>#{order?.orderId}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-500 dark:text-slate-400'>Total</p>
                    <p className='text-lg font-bold text-gray-900 dark:text-white'>
                      {DisplayPriceInRupees(Number.isFinite(orderTotal) ? orderTotal : 0)}
                    </p>
                  </div>
                </div>

                <div className='mt-4 flex items-center gap-3'>
                  <img
                    src={order?.product_details?.image?.[0]}
                    className='w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-2'
                    alt={order?.product_details?.name}
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>
                      {order?.product_details?.name}
                    </p>
                    <div className='mt-2 flex flex-wrap items-center gap-2 text-xs'>
                      <span className='px-2 py-1 rounded-full bg-green-100 text-green-700'>
                        {paymentStatus}
                      </span>
                      <span className='px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                        Qty: {order?.quantity || 1}
                      </span>
                      <span className='px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                        {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MyOrders

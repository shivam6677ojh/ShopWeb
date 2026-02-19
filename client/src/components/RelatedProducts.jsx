import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardProduct from './CardProduct'
import CardLoading from './CardLoading'
import AxiosToastError from '../utils/AxiosToastError'
import PropTypes from 'prop-types'

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const loadingArray = new Array(6).fill(null)

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: categoryId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        // Filter out current product
        const filtered = responseData.data.filter(p => p._id !== currentProductId)
        setData(filtered.slice(0, 6))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchRelatedProducts()
    }
  }, [categoryId, currentProductId])

  return (
    <section className='py-12 bg-gradient-to-b from-white to-luxury-cream/20 dark:from-slate-950 dark:to-slate-900'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2'>
            Related <span className='text-luxury-gold'>Products</span>
          </h2>
          <div className='w-16 h-1 bg-luxury-gold rounded-full'></div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {loading ?
            loadingArray.map((_, index) => (
              <CardLoading key={index} />
            ))
            :
            data.length > 0 ?
              data.map((product) => (
                <CardProduct key={product._id} data={product} />
              ))
              :
              <div className='col-span-full text-center py-12'>
                <p className='text-gray-600 dark:text-slate-400 text-lg'>No related products found</p>
              </div>
          }
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts

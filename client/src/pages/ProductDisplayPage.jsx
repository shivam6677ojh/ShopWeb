import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaTruck, FaLeaf, FaStar, FaHeart, FaRegHeart } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import RelatedProducts from '../components/RelatedProducts'
import { motion } from 'framer-motion'
import { fadeIn } from '../utils/motion'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  return (
    <section className='container mx-auto px-4 lg:px-12 py-12'>
      <div className='grid lg:grid-cols-2 gap-12 lg:gap-20'>
        {/* Left: Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col gap-6'
        >
          {/* Main Image */}
          <div className='bg-primary-light dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-luxury-gold/10 aspect-square relative group'>
            <img
              src={data.image[image]}
              className='w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500'
              alt={data.name}
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none' />
          </div>

          {/* Thumbnails */}
          <div className='relative'>
            <div ref={imageContainer} className='flex gap-4 overflow-x-auto scrollbar-none pb-2'>
              {
                data.image.map((img, index) => {
                  return (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      key={img + index}
                      onClick={() => setImage(index)}
                      className={`w-24 h-24 min-w-[6rem] cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${index === image ? 'border-luxury-gold ring-2 ring-luxury-gold/30' : 'border-transparent bg-gray-100 dark:bg-slate-800'}`}
                    >
                      <img
                        src={img}
                        alt='product thumbnail'
                        className='w-full h-full object-contain p-2'
                      />
                    </motion.div>
                  )
                })
              }
            </div>
          </div>
        </motion.div>

        {/* Right: Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='flex flex-col'
        >
          {/* Badges */}
          <div className='flex items-center gap-3 mb-6'>
            <span className='px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider'>
              In Stock
            </span>
            {data.discount && (
              <span className='px-3 py-1 bg-luxury-gold text-white text-xs font-bold rounded-full uppercase tracking-wider'>
                {data.discount}% OFF
              </span>
            )}
          </div>

          {/* Title & Rating */}
          <h1 className='text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 leading-tight'>{data.name}</h1>

          <div className='flex items-center gap-4 mb-8 text-sm'>
            <div className='flex text-luxury-gold'>
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
            <span className='text-gray-500 dark:text-gray-400'>(128 Reviews)</span>
            <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
            <span className='text-gray-500 dark:text-gray-400'>{data.unit}</span>
          </div>

          {/* Price */}
          <div className='mb-8'>
            <div className='flex items-baseline gap-4'>
              <span className='text-4xl font-serif text-luxury-gold font-medium'>
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </span>
              {data.discount && (
                <span className='text-xl text-gray-400 line-through decoration-1'>
                  {DisplayPriceInRupees(data.price)}
                </span>
              )}
            </div>
            <p className='text-sm text-gray-500 mt-2'>Inclusive of all taxes</p>
          </div>

          {/* Actions */}
          <div className='flex gap-4 mb-10'>
            <div className='flex-1 max-w-xs'>
              <AddToCartButton data={data} />
            </div>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className='p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-all'
            >
              {isWishlisted ? <FaHeart className='text-red-500 text-xl' /> : <FaRegHeart className='text-xl' />}
            </button>
          </div>

          <Divider />

          {/* Description */}
          <div className='py-8 space-y-6'>
            <div>
              <h3 className='text-lg font-serif font-bold text-gray-900 dark:text-white mb-3'>Description</h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed font-light'>
                {data.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
              <div className='flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-luxury-gold/10'>
                <div className='w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold'>
                  <FaTruck text-lg />
                </div>
                <div>
                  <p className='font-semibold text-gray-900 dark:text-white text-sm'>Fast Delivery</p>
                  <p className='text-xs text-gray-500'>Within 24 hours</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-luxury-gold/10'>
                <div className='w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold'>
                  <FaShieldAlt text-lg />
                </div>
                <div>
                  <p className='font-semibold text-gray-900 dark:text-white text-sm'>Authentic</p>
                  <p className='text-xs text-gray-500'>100% Original</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      <div className='mt-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-serif text-gray-900 dark:text-white mb-2'>You May Also Like</h2>
          <div className='w-16 h-1 bg-luxury-gold mx-auto rounded-full'></div>
        </div>
        <RelatedProducts categoryId={data?.category?.[0]} currentProductId={productId} />
      </div>
    </section>
  )
}

export default ProductDisplayPage

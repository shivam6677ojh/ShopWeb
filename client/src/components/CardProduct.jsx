import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'
import { FaHeart, FaRegHeart } from "react-icons/fa6";

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [loading, setLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Link to={url} className='product-card group border border-luxury-gold/20 py-2 lg:p-4 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded-lg cursor-pointer bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:border-luxury-gold/50 dark:border-luxury-gold/10' >

      {/* Image Container with Overlay */}
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded-lg overflow-hidden relative bg-luxury-cream dark:bg-slate-800'>
        <img
          src={data.image[0]}
          className='w-full h-full object-scale-down lg:scale-125 group-hover:scale-110 transition-transform duration-300'
        />
        {/* Quick View Overlay */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100'>
          <span className='text-white font-semibold text-sm'>Quick View</span>
        </div>
      </div>

      {/* Badge Section */}
      <div className='flex items-center gap-2 px-2 lg:px-0'>
        <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-300'>
          ⚡ 10 min
        </div>
        <div>
          {
            Boolean(data.discount) && (
              <p className='text-white bg-luxury-gold px-2 w-fit text-xs rounded-full font-semibold'>{data.discount}% OFF</p>
            )
          }
        </div>
      </div>

      {/* Product Name */}
      <div className='px-2 lg:px-0 font-semibold text-ellipsis text-sm lg:text-base line-clamp-2 text-gray-900 dark:text-slate-100 group-hover:text-luxury-gold transition-colors'>
        {data.name}
      </div>

      {/* Unit/Weight */}
      <div className='w-fit gap-1 px-2 lg:px-0 text-xs lg:text-sm text-gray-600 dark:text-slate-400'>
        {data.unit}
      </div>

      {/* Price & Action */}
      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-2 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-bold text-luxury-gold text-base lg:text-lg'>
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className='text-lg transition-colors duration-200'
        >
          {isWishlisted ? <FaHeart className='text-red-500' /> : <FaRegHeart className='text-gray-400 hover:text-red-500' />}
        </button>
      </div>

      {/* Stock & Button */}
      <div className='px-2 lg:px-0'>
        {
          data.stock == 0 ? (
            <p className='text-red-500 text-sm font-semibold text-center py-2 bg-red-50 dark:bg-red-900/20 rounded'>Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )
        }
      </div>

    </Link>
  )
}

CardProduct.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.array,
    unit: PropTypes.string,
    price: PropTypes.number,
    discount: PropTypes.number,
    stock: PropTypes.number
  })
}

export default CardProduct

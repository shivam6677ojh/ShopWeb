import React, { useState } from 'react'
import { FaStar } from "react-icons/fa6";
import PropTypes from 'prop-types'

const CustomerReviews = ({ productId }) => {
  const [reviews] = useState([
    {
      id: 1,
      author: "Deepak Kumar",
      rating: 5,
      date: "15 days ago",
      title: "Excellent Quality!",
      text: "Great product quality and fast delivery. Highly recommended for everyone!",
      helpful: 124
    },
    {
      id: 2,
      author: "Priya Singh",
      rating: 5,
      date: "22 days ago",
      title: "Perfect for daily use",
      text: "Exactly as described. Great value for money. Will definitely order again.",
      helpful: 98
    },
    {
      id: 3,
      author: "Rajesh Patel",
      rating: 4,
      date: "1 month ago",
      title: "Good but packaging could be better",
      text: "Product quality is excellent but packaging needed improvement. Still happy with the purchase.",
      helpful: 56
    },
    {
      id: 4,
      author: "Anjali Sharma",
      rating: 5,
      date: "1 month ago",
      title: "Best purchase this month",
      text: "Authentic product, amazing quality. The 10-minute delivery was spot on!",
      helpful: 142
    }
  ])

  const [sortBy, setSortBy] = useState('helpful')

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${i < rating ? 'text-luxury-gold' : 'text-gray-300 dark:text-slate-600'}`}
      />
    ))
  }

  return (
    <section className='py-12 bg-white dark:bg-slate-950'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4'>
            Customer <span className='text-luxury-gold'>Reviews</span>
          </h2>
          <div className='flex items-center gap-6 py-4 border-b border-luxury-gold/20 dark:border-luxury-gold/10'>
            {/* Rating Summary */}
            <div className='flex items-center gap-4'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-luxury-gold'>4.8</div>
                <div className='flex justify-center gap-1'>
                  {renderStars(5)}
                </div>
                <p className='text-xs text-gray-600 dark:text-slate-400 mt-1'>2,540 Reviews</p>
              </div>
              <div className='border-l border-gray-300 dark:border-slate-600 h-16'></div>

              {/* Rating Breakdown */}
              <div className='space-y-1 text-sm'>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className='flex items-center gap-2'>
                    <span className='w-12 text-gray-600 dark:text-slate-400'>{stars} ⭐</span>
                    <div className='w-32 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-luxury-gold'
                        style={{ width: `${stars === 5 ? 85 : stars === 4 ? 10 : stars === 3 ? 3 : 1}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className='flex justify-between items-center mb-6'>
          <button className='px-6 py-2 bg-luxury-gold text-white font-semibold rounded-lg hover:bg-luxury-gold/90 transition-all'>
            Write a Review
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='px-4 py-2 border border-luxury-gold/30 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-luxury-gold'
          >
            <option value='helpful'>Most Helpful</option>
            <option value='recent'>Most Recent</option>
            <option value='highest'>Highest Rating</option>
            <option value='lowest'>Lowest Rating</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className='space-y-4'>
          {reviews.map((review) => (
            <div key={review.id} className='bg-white dark:bg-slate-900 p-6 rounded-lg border border-luxury-gold/20 hover:shadow-md transition-all'>
              {/* Review Header */}
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='flex gap-1'>
                      {renderStars(review.rating)}
                    </div>
                    <span className='font-semibold text-gray-900 dark:text-slate-100'>{review.title}</span>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-slate-400'>
                    by <span className='font-semibold text-gray-900 dark:text-slate-100'>{review.author}</span> • {review.date}
                  </p>
                </div>
                <div className='text-right'>
                  <div className='inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full'>
                    ✓ Verified Purchase
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className='text-gray-700 dark:text-slate-300 mb-4 leading-relaxed'>{review.text}</p>

              {/* Helpful/Actions */}
              <div className='flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-slate-700'>
                <button className='text-sm text-gray-600 dark:text-slate-400 hover:text-luxury-gold transition-colors flex items-center gap-2'>
                  👍 Helpful ({review.helpful})
                </button>
                <button className='text-sm text-gray-600 dark:text-slate-400 hover:text-luxury-gold transition-colors'>
                  👎 Not Helpful
                </button>
                <button className='text-sm text-gray-600 dark:text-slate-400 hover:text-luxury-gold transition-colors'>
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className='text-center mt-8'>
          <button className='px-8 py-3 border-2 border-luxury-gold text-luxury-gold font-semibold rounded-lg hover:bg-luxury-gold/10 transition-all'>
            Load More Reviews
          </button>
        </div>
      </div>
    </section>
  )
}

CustomerReviews.propTypes = {
  productId: PropTypes.string
}

export default CustomerReviews

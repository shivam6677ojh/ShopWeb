import React from 'react'
import { FaStar } from "react-icons/fa6";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "👩‍💼",
      rating: 5,
      text: "Excellent quality products and super fast delivery. The shopping experience is brilliant!",
      color: "#FFB6C1"
    },
    {
      id: 2,
      name: "Raj Patel",
      role: "Verified Buyer",
      image: "👨‍💻",
      rating: 5,
      text: "Best prices in town with authentic products. Customer service is responsive and helpful.",
      color: "#87CEEB"
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Loyal Customer",
      image: "👩‍🎨",
      rating: 5,
      text: "Premium quality guaranteed. I've been a customer for 2 years and never disappointed!",
      color: "#98FB98"
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      role: "Bulk Buyer",
      image: "👨‍🍳",
      rating: 5,
      text: "Outstanding service and variety. Competitive prices and reliable delivery every time.",
      color: "#FFD700"
    }
  ]

  return (
    <section className='py-16 bg-gradient-to-b from-luxury-cream/30 to-white dark:from-slate-900 dark:to-slate-950'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 dark:text-slate-100 mb-3'>
            Customer <span className='text-luxury-gold'>Love</span>
          </h2>
          <p className='text-gray-600 dark:text-slate-400 max-w-2xl mx-auto'>
            Trusted by thousands of happy customers who enjoy quality, reliability, and exceptional service
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className='group bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-luxury-gold/10 hover:border-luxury-gold/50'
            >
              {/* Rating */}
              <div className='flex gap-1 mb-4'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className='text-luxury-gold text-sm' />
                ))}
              </div>

              {/* Text */}
              <p className='text-gray-700 dark:text-slate-300 text-sm mb-6 italic'>
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className='flex items-center gap-3'>
                <div 
                  className='w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform'
                  style={{ backgroundColor: testimonial.color + '30' }}
                >
                  {testimonial.image}
                </div>
                <div>
                  <p className='font-semibold text-gray-900 dark:text-slate-100 text-sm'>{testimonial.name}</p>
                  <p className='text-xs text-gray-600 dark:text-slate-400'>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className='mt-16 pt-8 border-t border-luxury-gold/20 dark:border-luxury-gold/10'>
          <h3 className='text-center text-gray-900 dark:text-slate-100 font-semibold mb-8'>Trusted By</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto'>
            <div className='flex flex-col items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-luxury-gold/10'>
              <span className='text-2xl'>✓</span>
              <p className='text-xs text-center text-gray-600 dark:text-slate-400'>100% Authentic</p>
            </div>
            <div className='flex flex-col items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-luxury-gold/10'>
              <span className='text-2xl'>🚚</span>
              <p className='text-xs text-center text-gray-600 dark:text-slate-400'>Fast Delivery</p>
            </div>
            <div className='flex flex-col items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-luxury-gold/10'>
              <span className='text-2xl'>💳</span>
              <p className='text-xs text-center text-gray-600 dark:text-slate-400'>Secure Payment</p>
            </div>
            <div className='flex flex-col items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-luxury-gold/10'>
              <span className='text-2xl'>🤝</span>
              <p className='text-xs text-center text-gray-600 dark:text-slate-400'>24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

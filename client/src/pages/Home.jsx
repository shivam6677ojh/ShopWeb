import React from 'react'
// banner images removed for CSS background
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import Testimonials from '../components/Testimonials'
import { motion } from 'framer-motion'
import HeroSlider from '../components/HeroSlider'
import HeroStrip from '../components/HeroStrip'
import { fadeIn, staggerContainer } from '../utils/motion'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

    navigate(url)
    console.log(url)
  }


  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className='bg-primary-light dark:bg-primary-dark overflow-hidden'
    >
      {/* Hero Section - split layout: text left, slider right */}
      <div className='relative w-full h-[95vh]'>
        <motion.div
          className='absolute inset-0 z-0 luxury-hero-bg-light dark:luxury-hero-bg-dark transition-colors duration-1000'
        />

        <div className='relative z-20 container mx-auto h-full px-4 lg:px-12 flex items-center'>
          <div className='w-full lg:w-[38%] flex flex-col justify-center py-8'>
            <motion.h1
              variants={fadeIn("left", "spring", 0.6, 1)}
              className='text-5xl lg:text-7xl font-serif text-gray-900 dark:text-white font-bold mb-6'
            >
              Experience <span className='text-luxury-gold inline-block'>Luxury</span> <br />
              Delivered to You.
            </motion.h1>
            <motion.p
              variants={fadeIn("up", "spring", 0.7, 1)}
              className='text-gray-700 dark:text-gray-300 text-lg lg:text-xl max-w-xl mb-10 font-light'
            >
              Discover a curated collection of premium essentials. Quality, elegance, and speed combined in one seamless experience.
            </motion.p>
            <motion.button
              variants={fadeIn("up", "spring", 0.9, 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='w-fit bg-luxury-gold hover:bg-luxury-gold-hover text-white px-10 py-4 rounded-full font-serif text-lg tracking-wide shadow-2xl shadow-luxury-gold/30 transition-all'
              onClick={() => document.getElementById('shop-category').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Collection
            </motion.button>
          </div>

          <div className='hidden lg:block w-[62%] pl-8'>
            {/* Slider component inserted here */}
            <HeroSlider />
            <HeroStrip />
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div id='shop-category' className='container mx-auto px-4 my-20'>
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className='text-center mb-12'>
          <h2 className='text-4xl font-serif text-gray-900 dark:text-inventory-cream dark:text-slate-100 mb-3'>Shop by Category</h2>
          <div className='w-24 h-1 bg-luxury-gold mx-auto rounded-full'></div>
        </motion.div>

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {
            loadingCategory ? (
              new Array(10).fill(null).map((c, index) => {
                return (
                  <div key={index + "loadingcategory"} className='bg-white dark:bg-slate-900 rounded-xl p-4 min-h-36 grid gap-2 shadow-sm animate-pulse border border-luxury-gold/10'>
                    <div className='bg-luxury-gold/10 min-h-20 rounded-lg'></div>
                    <div className='bg-luxury-gold/10 h-6 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat, index) => {
                // Staggered animation for list items 
                // Note: Ideally extract to separate component for individual item animations
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={cat._id + "displayCategory"}
                    className='w-full group cursor-pointer'
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className='rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-luxury-gold/10 hover:border-luxury-gold/40 dark:bg-slate-800 bg-white relative aspect-square flex items-center justify-center p-6'>
                      <div className='absolute inset-0 bg-luxury-gold/0 group-hover:bg-luxury-gold/5 transition-colors duration-500'></div>
                      <img
                        src={cat.image}
                        className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 blend-multiply dark:blend-normal'
                      />
                    </div>
                    <p className='text-center mt-4 font-serif text-lg text-gray-800 dark:text-slate-200 group-hover:text-luxury-gold transition-colors'>{cat.name}</p>
                  </motion.div>
                )
              })

            )
          }
        </div>
      </div>

      {/***display category product */}
      <div className='mt-20 space-y-20'>
        {
          categoryData?.slice(0, 4).map((c, index) => {
            return (
              <div key={c?._id + "CategorywiseProduct"} className='container mx-auto px-4'>
                <CategoryWiseProductDisplay
                  id={c?._id}
                  name={c?.name}
                />
              </div>
            )
          })
        }
      </div>

      {/* Testimonials Section */}
      <div className='py-20 bg-luxury-gold/5 mt-20'>
        <Testimonials />
      </div>

    </motion.section>
  )
}

export default Home

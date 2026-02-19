import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
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
        fetchCategoryWiseProduct()
    }, [])

    useEffect(() => {
        const slider = containerRef.current
        if (!slider) return

        const intervalId = setInterval(() => {
            if (isPaused) return

            const maxScrollLeft = slider.scrollWidth - slider.clientWidth
            if (maxScrollLeft <= 0) return

            const nextScrollLeft = slider.scrollLeft + 260
            if (nextScrollLeft >= maxScrollLeft - 5) {
                slider.scrollTo({ left: 0, behavior: 'smooth' })
                return
            }

            slider.scrollBy({ left: 260, behavior: 'smooth' })
        }, 2500)

        return () => clearInterval(intervalId)
    }, [data.length, isPaused])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    

  

  const handleRedirectProductListpage = ()=>{
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

      return url
  }

  const redirectURL =  handleRedirectProductListpage()
    return (
        <div className='py-8'>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4 border-b border-luxury-gold/20 pb-4 dark:border-luxury-gold/10'>
                <h3 className='font-bold text-2xl md:text-3xl text-gray-900 dark:text-slate-100 relative'>
                  <span className='bg-gradient-to-r from-luxury-gold to-luxury-gold/70 bg-clip-text text-transparent'>{name}</span>
                  <div className='absolute bottom-0 left-0 w-16 h-1 bg-luxury-gold rounded-full'></div>
                </h3>
                <Link  to={redirectURL} className='text-luxury-gold hover:text-luxury-gold/80 font-semibold flex items-center gap-2 transition-all'>See All <span>→</span></Link>
            </div>
            <div className='relative flex items-center '>
                <div
                    className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth'
                    ref={containerRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }


                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct
                                    data={p}
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                />
                            )
                        })
                    }

                </div>
                <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-primary-200 hover:bg-primary-100 shadow-lg text-lg p-3 rounded-full transition-colors duration-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative bg-primary-200 hover:bg-primary-100 shadow-lg p-3 text-lg rounded-full transition-colors duration-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100'>
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay

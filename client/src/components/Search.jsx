import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';


const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])


    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[500px] h-12 rounded-full border-2 border-luxury-gold/30 overflow-hidden flex items-center bg-white dark:bg-slate-900 group hover:border-luxury-gold focus-within:border-luxury-gold focus-within:shadow-lg focus-within:shadow-luxury-gold/20 transition-all duration-300'>
        <div>
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-all'>
                        <FaArrowLeft size={20}/>
                    </Link>
                ) :(
                    <button className='flex justify-center items-center h-full px-4 text-luxury-gold group-hover:scale-110 transition-all'>
                        <IoSearch size={22}/>
                    </button>
                )
            }
        </div>
        <div className='w-full h-full'>
            {
                !isSearchPage ? (
                     //not in search page
                     <div onClick={redirectToSearchPage} className='w-full h-full flex items-center cursor-pointer'>
                        <TypeAnimation
                                sequence={[
                                    'Search "milk"',
                                    1000,
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "cheese"',
                                    1000,
                                    'Search "chocolate"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "egg"',
                                    1000,
                                    'Search "chips"',
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                                className='text-gray-500 dark:text-slate-500 italic'
                            />
                     </div>
                ) : (
                    //when i was search page
                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for products...'
                            autoFocus
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 px-4'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
        
    </div>
  )
}

export default Search

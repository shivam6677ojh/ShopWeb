import React, { useEffect, useRef, useState } from 'react'
import { IoMicOutline, IoSearch } from "react-icons/io5";
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
    const [query, setQuery] = useState("")
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef(null)
    const searchText = new URLSearchParams(params.search).get("q") || ""
    const isSpeechSupported = typeof window !== "undefined" && (
        "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    )

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])

    useEffect(() => {
        setQuery(searchText)
    }, [searchText])

    useEffect(() => {
        if (!isSpeechSupported || recognitionRef.current) {
            return
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-IN"

        recognition.onresult = (event) => {
            let transcript = ""
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                transcript += event.results[i][0].transcript
            }

            const nextQuery = transcript.trim()
            setQuery(nextQuery)

            const lastResult = event.results[event.results.length - 1]
            if (lastResult?.isFinal && nextQuery) {
                navigate(`/search?q=${encodeURIComponent(nextQuery)}`)
            }
        }

        recognition.onerror = () => {
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = recognition
    }, [isSpeechSupported, navigate])


    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        setQuery(value)
        const url = `/search?q=${encodeURIComponent(value)}`
        navigate(url)
    }

    const handleVoiceToggle = ()=>{
        if (!isSpeechSupported) {
            return
        }

        if (!isSearchPage) {
            navigate("/search")
        }

        if (isListening) {
            recognitionRef.current?.stop()
            return
        }

        setIsListening(true)
        recognitionRef.current?.start()
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
                            value={query}
                            className='bg-transparent w-full h-full outline-none text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 px-4'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
        <div>
            <button
                type="button"
                onClick={handleVoiceToggle}
                disabled={!isSpeechSupported}
                aria-label={isListening ? "Stop voice search" : "Start voice search"}
                className={`flex justify-center items-center h-full px-4 ${isListening ? "text-red-500" : "text-luxury-gold"} disabled:text-gray-400 disabled:cursor-not-allowed transition-all`}
                title={isSpeechSupported ? "Voice search" : "Voice search not supported"}
            >
                <IoMicOutline size={22}/>
            </button>
        </div>
        
    </div>
  )
}

export default Search

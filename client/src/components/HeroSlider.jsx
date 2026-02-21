import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import banner from '../assets/banner.jpg'
import BestPrices from '../assets/Best_Prices_Offers.png'
import WideAssortment from '../assets/Wide_Assortment.png'

const slides = [
  {
    id: 1,
    key: 'trends',
    image: banner,
    tag: 'TRENDING',
    title: 'Fresh Market Trends 2026',
    subtitle: "What's hot in groceries this season",
    buttonText: 'Shop Trends'
  },
  {
    id: 2,
    key: 'holi',
    image: BestPrices,
    tag: 'FESTIVAL SPECIAL',
    title: 'Celebrate Holi with Sweet Savings',
    subtitle: 'Colors, sweets & festive essentials',
    buttonText: 'Explore Holi Offers'
  },
  {
    id: 3,
    key: 'essentials',
    image: WideAssortment,
    tag: 'DAILY ESSENTIALS',
    title: 'Everyday Grocery Essentials',
    subtitle: 'Farm fresh. Fast delivery.',
    buttonText: 'Shop Essentials'
  }
]

const TRANSITION = { duration: 0.7, ease: [0.65, 0, 0.35, 1] }

function HoliParticles() {
  return (
    <div className='absolute inset-0 pointer-events-none'>
      <div className='holi-particles' />
    </div>
  )
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [holiSrc, setHoliSrc] = useState(null)
  const timerRef = useRef(null)
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const controls = useAnimation()
  const progressRefs = useRef([])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Safely locate any holi asset (webp/png/jpg) using Vite glob so missing file won't break HMR
  useEffect(() => {
    const modules = import.meta.glob('../assets/holi.*', { eager: true })
    const keys = Object.keys(modules)
    if (keys.length) {
      const webp = keys.find(k => k.endsWith('.webp'))
      const png = keys.find(k => k.endsWith('.png'))
      const jpg = keys.find(k => k.endsWith('.jpg') || k.endsWith('.jpeg'))
      const chosen = webp || png || jpg || keys[0]
      const mod = modules[chosen]
      const url = mod && (mod.default || mod)
      if (url) setHoliSrc(url)
    }
  }, [])

  useEffect(() => {
    // animate content when slide changes
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } })
    // reset and animate progress bar for active dot
    progressRefs.current.forEach((el) => {
      if (!el) return
      el.style.transition = 'none'
      el.style.transform = 'scaleX(0)'
    })
    const active = progressRefs.current[index]
    if (active) {
      requestAnimationFrame(() => {
        active.style.transition = 'transform 4s linear'
        active.style.transform = 'scaleX(1)'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const startTimer = (delay = 4000) => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % slides.length), delay)
  }

  const goPrev = () => { setIndex(i => (i - 1 + slides.length) % slides.length); startTimer() }
  const goNext = () => { setIndex(i => (i + 1) % slides.length); startTimer() }
  const onDot = (i) => { setIndex(i); startTimer() }

  // parallax + subtle tilt using rAF
  useEffect(() => {
    const el = containerRef.current
    let raf = null
    if (!el) return

    const handleMove = (e) => {
      if (!imgRef.current) return
      const rect = el.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const x = (clientX - rect.left) / rect.width - 0.5
      const y = (clientY - rect.top) / rect.height - 0.5

      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const tiltX = y * 6
        const tiltY = x * -8
        el.style.transform = `translateZ(0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${Math.sin(Date.now()/3000)*6}px)`
        imgRef.current.style.transform = `translate(${x * 18}px, ${y * 12}px) scale(1.06)`
      })
    }

    const reset = () => {
      if (raf) cancelAnimationFrame(raf)
      el.style.transform = ''
      if (imgRef.current) imgRef.current.style.transform = ''
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('touchmove', handleMove)
    el.addEventListener('mouseleave', reset)
    el.addEventListener('touchend', reset)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('touchmove', handleMove)
      el.removeEventListener('mouseleave', reset)
      el.removeEventListener('touchend', reset)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div
        ref={containerRef}
        className='relative w-full max-w-[980px] rounded-[28px] overflow-hidden shadow-[0_60px_120px_rgba(16,16,16,0.45)] transform-gpu will-change-transform floating-anim'
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={() => startTimer()}
        style={{ perspective: 1200 }}
      >
        <div className='absolute -left-32 -top-28 w-80 h-80 rounded-full bg-gradient-to-tr from-yellow-400/30 to-transparent blur-3xl pointer-events-none -z-10' />

        {/* Render previous, current, next slides so adjacent slots are visible */}
        <div className='relative w-full h-[600px]'>
          {
            (() => {
              const prev = (index - 1 + slides.length) % slides.length
              const next = (index + 1) % slides.length
              const current = index
              const prevSlide = slides[prev]
              const currSlide = slides[current]
              const nextSlide = slides[next]

              return (
                <>
                  {/* previous (left) - partially visible */}
                  <motion.div
                    key={prevSlide.key}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 0.7, x: -24 }}
                    transition={TRANSITION}
                    className='absolute top-0 left-0 w-1/3 h-full overflow-hidden pointer-events-none'
                  >
                    <img src={prevSlide.image} alt={prevSlide.title} className='w-full h-full object-cover rounded-l-[28px] opacity-70' />
                    <div className='absolute inset-0 bg-gradient-to-r from-black/40 to-transparent' />
                  </motion.div>

                  {/* current (center) - main slide */}
                  <motion.div
                    key={currSlide.key}
                    initial={{ opacity: 0, x: 48 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={TRANSITION}
                    className='absolute top-0 left-1/6 w-2/3 h-full rounded-[28px] overflow-hidden'
                  >
                    <motion.img
                      ref={imgRef}
                      src={currSlide.key === 'holi' ? (holiSrc || currSlide.image) : currSlide.image}
                      loading='lazy'
                      alt={currSlide.title}
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.06 }}
                      exit={{ scale: 1 }}
                      transition={{ duration: 8, ease: 'linear' }}
                      style={{ transformOrigin: 'center center' }}
                      className='w-full h-full object-cover'
                    />

                    <div className='grain-overlay' />
                    <div className='absolute inset-0 bg-gradient-to-r from-black/55 via-black/12 to-transparent pointer-events-none' />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={controls}
                      className='absolute left-8 top-8 text-gray-900 max-w-lg backdrop-blur-md bg-white/6 border border-luxury-gold/20 rounded-xl p-5'
                    >
                      <div className='inline-block px-3 py-1 backdrop-blur-md bg-white/10 border border-luxury-gold rounded-full text-xs font-semibold text-luxury-gold mb-3 uppercase tracking-widest'>{currSlide.tag}</div>
                      <h3 className='text-4xl lg:text-5xl font-serif font-extrabold tracking-wide leading-tight text-gray-900'>{currSlide.title}</h3>
                      <p className='mt-2 text-base lg:text-lg text-gray-800 tracking-wide opacity-90'>{currSlide.subtitle}</p>
                      <button
                        onClick={() => document.getElementById('shop-category')?.scrollIntoView({ behavior: 'smooth' })}
                        className='mt-5 inline-block bg-luxury-gold text-white px-6 py-3 rounded-full font-medium shadow-2xl hover:scale-105 active:scale-95 transition transform-gpu'
                      >
                        {currSlide.buttonText}
                      </button>
                    </motion.div>

                    {currSlide.key === 'holi' && (
                      <div className='absolute inset-0 pointer-events-none'>
                        <div className='holi-particles' />
                        <div className='absolute inset-0 bg-gradient-to-tr from-pink-400/10 via-orange-300/6 to-transparent mix-blend-screen pointer-events-none' />
                      </div>
                    )}
                  </motion.div>

                  {/* next (right) - partially visible */}
                  <motion.div
                    key={nextSlide.key}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 0.7, x: 24 }}
                    transition={TRANSITION}
                    className='absolute top-0 right-0 w-1/3 h-full overflow-hidden pointer-events-none'
                  >
                    <img src={nextSlide.image} alt={nextSlide.title} className='w-full h-full object-cover rounded-r-[28px] opacity-70' />
                    <div className='absolute inset-0 bg-gradient-to-l from-black/40 to-transparent' />
                  </motion.div>
                </>
              )
            })()
          }
        </div>

        <div className='absolute inset-0 pointer-events-none shadow-inner' />

        <div className='absolute top-4 right-6 flex items-center gap-3 z-20'>
          <button aria-label='prev' onClick={goPrev} className='glass-arrow'>‹</button>
          <button aria-label='next' onClick={goNext} className='glass-arrow'>›</button>
        </div>

        <div className='absolute left-8 bottom-8 flex items-center gap-3 z-20'>
          {slides.map((s, i) => (
            <div key={s.id} className='flex items-center gap-2'>
              <button
                onClick={() => onDot(i)}
                className={`dot-capsule ${i === index ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  ref={el => progressRefs.current[i] = el}
                  className='progress block h-full w-full origin-left rounded-full'
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
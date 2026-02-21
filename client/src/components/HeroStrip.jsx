import React from 'react'

const assets = [
  '/src/assets/banner.jpg',
  '/src/assets/Best_Prices_Offers.png',
  '/src/assets/Wide_Assortment.png',
  '/src/assets/Binkeyit.png',
  '/src/assets/minute_delivery.png'
]

export default function HeroStrip() {
  // Duplicate the list for seamless loop
  const items = [...assets, ...assets]

  return (
    <div className='hero-strip mt-6 lg:mt-10'>
      <div className='strip-mask-left' />
      <div className='strip-mask-right' />
      <div className='strip-track'>
        {items.map((src, i) => (
          <div key={i} className='strip-item'>
            <img src={src} alt={`strip-${i}`} className='w-full h-full object-cover' />
          </div>
        ))}
      </div>
    </div>
  )
}

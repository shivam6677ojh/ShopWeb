import React, { useState } from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault()
    // Logic would go here
  }

  return (
    <footer className='border-t border-luxury-gold/10 bg-primary-dark text-luxury-cream mt-auto'>
      {/* Newsletter Section */}
      <div className='bg-white/5 border-b border-luxury-gold/10'>
        <div className='container mx-auto p-12'>
          <div className='max-w-2xl mx-auto text-center'>
            <h3 className='text-3xl font-serif text-luxury-gold mb-4'>Join the Inner Circle</h3>
            <p className='text-gray-400 mb-8 font-light'>Subscribe to receive updates, access to exclusive deals, and more.</p>

            <form onSubmit={handleNewsletterSubscribe} className='flex flex-col md:flex-row gap-4'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
                className='flex-1 px-6 py-4 rounded-full border border-luxury-gold/20 bg-primary-dark text-luxury-cream placeholder-gray-600 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all'
              />
              <button
                type='submit'
                className='px-10 py-4 bg-luxury-gold hover:bg-luxury-gold-hover text-white font-medium tracking-wide rounded-full transition-all duration-300 shadow-lg shadow-luxury-gold/20'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
        <div>
          <h2 className='text-3xl font-serif text-luxury-gold mb-6'>ShopWeb</h2>
          <p className='text-gray-400 font-light leading-relaxed mb-6'>
            Curated luxury essentials for the modern lifestyle. Quality, elegance, and speed in every delivery.
          </p>
          <div className='flex gap-6 text-xl text-luxury-gold'>
            <a href='#' className='hover:text-white transition-colors hover:scale-110 transform duration-300'><FaFacebook /></a>
            <a href='#' className='hover:text-white transition-colors hover:scale-110 transform duration-300'><FaInstagram /></a>
            <a href='#' className='hover:text-white transition-colors hover:scale-110 transform duration-300'><FaLinkedin /></a>
          </div>
        </div>

        <div>
          <h4 className='text-lg font-serif text-white mb-6'>Explore</h4>
          <ul className='space-y-4 text-gray-400 font-light'>
            <li><a href='/' className='hover:text-luxury-gold transition-colors'>Home</a></li>
            <li><a href='/search' className='hover:text-luxury-gold transition-colors'>Collection</a></li>
            <li><a href='/about' className='hover:text-luxury-gold transition-colors'>Our Story</a></li>
            <li><a href='/contact' className='hover:text-luxury-gold transition-colors'>Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className='text-lg font-serif text-white mb-6'>Support</h4>
          <ul className='space-y-4 text-gray-400 font-light'>
            <li><a href='#' className='hover:text-luxury-gold transition-colors'>FAQ</a></li>
            <li><a href='#' className='hover:text-luxury-gold transition-colors'>Shipping & Returns</a></li>
            <li><a href='#' className='hover:text-luxury-gold transition-colors'>Privacy Policy</a></li>
            <li><a href='#' className='hover:text-luxury-gold transition-colors'>Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className='text-lg font-serif text-white mb-6'>Contact</h4>
          <ul className='space-y-4 text-gray-400 font-light'>
            <li className='flex items-start gap-3'>
              <FaMapMarkerAlt className='text-luxury-gold mt-1' />
              <span>123 Luxury Ave, <br />Beverly Hills, CA 90210</span>
            </li>
            <li className='flex items-center gap-3'>
              <FaPhone className='text-luxury-gold' />
              <span>+1 (800) 123-4567</span>
            </li>
            <li className='flex items-center gap-3'>
              <FaEnvelope className='text-luxury-gold' />
              <span>concierge@shopweb.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className='border-t border-white/5 py-8 text-center text-sm text-gray-600'>
        © 2024 ShopWeb. All rights reserved. Designed for excellence.
      </div>
    </footer>
  )
}

export default Footer

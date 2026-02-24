import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

const AddAddress = ({close}) => {
    const { register, handleSubmit, reset, setValue } = useForm()
    const { fetchAddress } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const [fetchingLocation, setFetchingLocation] = useState(false)

    // Get current location using browser's geolocation
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser')
            return
        }

        setFetchingLocation(true)
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    await getAddressFromCoordinates(latitude, longitude)
                } catch (error) {
                    toast.error('Failed to get address from coordinates')
                } finally {
                    setFetchingLocation(false)
                }
            },
            (error) => {
                setFetchingLocation(false)
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Please allow location access to auto-fill address')
                        break
                    case error.POSITION_UNAVAILABLE:
                        toast.error('Location information is unavailable')
                        break
                    case error.TIMEOUT:
                        toast.error('Location request timed out')
                        break
                    default:
                        toast.error('Failed to get your location')
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    // Reverse geocoding to get address from coordinates
    const getAddressFromCoordinates = async (lat, lng) => {
        setLoading(true)
        
        try {
            // Using OpenStreetMap's Nominatim API (free, no API key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                    }
                }
            )
            
            const data = await response.json()
            
            if (data && data.address) {
                const address = data.address
                
                // Extract address components
                const addressLine = [
                    address.road || '',
                    address.suburb || '',
                    address.neighbourhood || ''
                ].filter(Boolean).join(', ')
                
                // Auto-fill the form
                setValue('addressline', addressLine || data.display_name?.split(',')[0] || '')
                setValue('city', address.city || address.town || address.village || '')
                setValue('state', address.state || '')
                setValue('country', address.country || '')
                setValue('pincode', address.postcode || '')
                
                toast.success('Location fetched successfully! Please verify the address.')
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error)
            toast.error('Failed to fetch address from location')
        } finally {
            setLoading(false)
        }
    }

    // Alternative: Using Google Maps Geocoding API (requires API key)
    const getAddressFromCoordinatesGoogle = async (lat, lng) => {
        setLoading(true)
        
        // You'll need to add your Google Maps API key to .env file
        const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        
        if (!GOOGLE_MAPS_API_KEY) {
            toast.error('Google Maps API key not configured')
            setLoading(false)
            return
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            )
            
            const data = await response.json()
            
            if (data.results && data.results[0]) {
                const addressComponents = data.results[0].address_components
                const formattedAddress = data.results[0].formatted_address
                
                // Extract address components
                let streetNumber = '', route = '', locality = '', 
                    adminArea = '', country = '', postalCode = ''
                
                addressComponents.forEach(component => {
                    const types = component.types
                    
                    if (types.includes('street_number')) {
                        streetNumber = component.long_name
                    }
                    if (types.includes('route')) {
                        route = component.long_name
                    }
                    if (types.includes('locality')) {
                        locality = component.long_name
                    }
                    if (types.includes('administrative_area_level_1')) {
                        adminArea = component.long_name
                    }
                    if (types.includes('country')) {
                        country = component.long_name
                    }
                    if (types.includes('postal_code')) {
                        postalCode = component.long_name
                    }
                })
                
                // Auto-fill the form
                setValue('addressline', `${streetNumber} ${route}`.trim() || formattedAddress.split(',')[0])
                setValue('city', locality)
                setValue('state', adminArea)
                setValue('country', country)
                setValue('pincode', postalCode)
                
                toast.success('Location fetched successfully! Please verify the address.')
            }
        } catch (error) {
            console.error('Google Geocoding error:', error)
            toast.error('Failed to fetch address from location')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async(data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold'>Add Address</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose size={25}/>
                    </button>
                </div>

                {/* Auto-fetch location button */}
                <div className='mt-4'>
                    <button
                        type='button'
                        onClick={getCurrentLocation}
                        disabled={fetchingLocation || loading}
                        className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2'
                    >
                        {fetchingLocation || loading ? (
                            <>
                                <FaSpinner className='animate-spin' />
                                Fetching your location...
                            </>
                        ) : (
                            <>
                                <FaMapMarkerAlt />
                                Use My Current Location
                            </>
                        )}
                    </button>
                    <p className='text-xs text-gray-500 mt-1 text-center'>
                        We'll fetch your address automatically using your location
                    </p>
                </div>

                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor='addressline'>Address Line :</label>
                        <input
                            type='text'
                            id='addressline' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("addressline", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='city'>City :</label>
                        <input
                            type='text'
                            id='city' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("city", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='state'>State :</label>
                        <input
                            type='text'
                            id='state' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("state", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='pincode'>Pincode :</label>
                        <input
                            type='text'
                            id='pincode' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("pincode", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='country'>Country :</label>
                        <input
                            type='text'
                            id='country' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("country", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='mobile'>Mobile No. :</label>
                        <input
                            type='text'
                            id='mobile' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("mobile", { required: true })}
                        />
                    </div>

                    <button 
                        type='submit' 
                        className='bg-primary-200 w-full py-2 font-semibold mt-4 hover:bg-primary-100 disabled:bg-gray-300'
                        disabled={loading || fetchingLocation}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress
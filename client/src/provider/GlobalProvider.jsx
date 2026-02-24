import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAddItemCart,
  removeCartItemOptimistic,
  updateCartItemOptimistic
} from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
     const [totalPrice,setTotalPrice] = useState(0)
     const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)
  const [theme, setTheme] = useState("light")

    const fetchCartItem = async()=>{
        try {
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
    
          if(responseData.success){
            dispatch(handleAddItemCart(responseData.data))
            console.log(responseData)
          }
    
        } catch (error) {
          console.log(error)
        }
    }

    const updateCartItem = async(id,qty)=>{
      dispatch(updateCartItemOptimistic({ _id: id, qty }))
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              // toast.success(responseData.message)
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        fetchCartItem()
        return error
      }
    }
    const deleteCartItem = async(cartId)=>{
      dispatch(removeCartItemOptimistic({ _id: cartId }))
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
         fetchCartItem()
      }
    }

    useEffect(() => {
      const qty = cartItem.reduce((prev, curr) => {
        const itemQty = Number(curr?.quantity)
        return prev + (Number.isFinite(itemQty) ? itemQty : 0)
      }, 0)
      setTotalQty(qty)

      const tPrice = cartItem.reduce((prev, curr) => {
        const priceAfterDiscount = pricewithDiscount(curr?.productId?.price, curr?.productId?.discount)
        const itemQty = Number(curr?.quantity)
        const safeQty = Number.isFinite(itemQty) ? itemQty : 0

        return prev + (priceAfterDiscount * safeQty)
      }, 0)
      setTotalPrice(tPrice)

      const notDiscountPrice = cartItem.reduce((prev, curr) => {
        const itemPrice = Number(curr?.productId?.price)
        const itemQty = Number(curr?.quantity)
        const safePrice = Number.isFinite(itemPrice) ? itemPrice : 0
        const safeQty = Number.isFinite(itemQty) ? itemQty : 0

        return prev + (safePrice * safeQty)
      }, 0)
      setNotDiscountTotalPrice(notDiscountPrice)
  }, [cartItem])

    const handleLogoutOut = ()=>{
      localStorage.removeItem("accesstoken")
      localStorage.removeItem("refreshToken")
      dispatch(handleAddItemCart([]))
    }

    const fetchAddress = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          // AxiosToastError(error)
      }
    }
    const fetchOrder = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      if (!user?._id) {
        handleLogoutOut()
        return
      }

      fetchCartItem()
      fetchAddress()
      fetchOrder()
    },[user])

    useEffect(() => {
      const storedTheme = localStorage.getItem("theme")
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme)
        return
      }

      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }, [])

    useEffect(() => {
      const root = document.documentElement
      if (theme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
      localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
      setTheme(prev => (prev === "dark" ? "light" : "dark"))
    }
    
    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
          fetchOrder,
          theme,
          toggleTheme
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart : []
}

const cartSlice = createSlice({
    name : "cartItem",
    initialState : initialState,
    reducers : {
        handleAddItemCart : (state,action)=>{
           state.cart = [...action.payload]
        },
        addCartItemOptimistic : (state,action)=>{
            const { product, quantity = 1 } = action.payload || {}
            if (!product?._id) {
                return
            }

            const existingItem = state.cart.find(item => item?.productId?._id === product._id)
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + quantity
                return
            }

            state.cart.push({
                _id: `temp-${product._id}`,
                productId: product,
                quantity: quantity
            })
        },
        updateCartItemOptimistic : (state,action)=>{
            const { _id, qty, productId } = action.payload || {}
            const nextQty = Number(qty)
            if (!Number.isFinite(nextQty)) {
                return
            }

            const target = state.cart.find(item => item?._id === _id) ||
                state.cart.find(item => item?.productId?._id === productId)

            if (target) {
                target.quantity = nextQty
            }
        },
        removeCartItemOptimistic : (state,action)=>{
            const { _id, productId } = action.payload || {}
            state.cart = state.cart.filter(item => {
                if (_id) {
                    return item?._id !== _id
                }
                if (productId) {
                    return item?.productId?._id !== productId
                }
                return true
            })
        }
    }
})

export const {
    handleAddItemCart,
    addCartItemOptimistic,
    updateCartItemOptimistic,
    removeCartItemOptimistic
} = cartSlice.actions

export default cartSlice.reducer
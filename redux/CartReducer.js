import { createSlice } from "@reduxjs/toolkit";

 const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find((item) => item.id === action.id);
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const removeItem = state.cart.filter((item) => item.id !== action.id);
      state.cart = removeItem;
    },
    increment: (state, action) => {
      const itemPresent = state.cart.find((item) => item.id === action.id);
      itemPresent.quantity++;
    },
    decrementItems: (state, action) => {
      const itemPresent = state.cart.find((item) => item.id === action.id);
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
        const removeItem = state.cart.filter((item) => item.id !== action.id);
        state.cart = removeItem;
      } else {
        itemPresent.quantity--;
      }
    },
    cleanCart: (state) => {
      state.cart = [];
    },
  },
});

export const {addToCart,removeFromCart,increment,decrementItems,cleanCart}=CartSlice.actions;
export default CartSlice.reducer;
"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i._id === action.payload._id);
      if (existing) {
        return state.map((i) =>
          i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i._id !== action.payload);
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return state.filter((i) => i._id !== action.payload.id);
      }
      return state.map((i) =>
        i._id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      );
    }
    case "CLEAR_CART":
      return [];
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Persist cart to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tt_cart");
    if (saved) {
      try {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tt_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

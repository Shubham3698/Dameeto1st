import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// 🔥 DYNAMIC API URL LOGIC
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://serdeptry1st.onrender.com";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // 🛠️ 1. Fresh User ID nikaalne ka logic (Email ya ID)
  const getFreshUserId = () => {
    const userData = localStorage.getItem("user");
    const userEmail = localStorage.getItem("userEmail"); // Aapke logs ke according

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        // Priority: Email (kyunki aapka logs email dikha raha hai) > _id > id
        return parsed.email || parsed._id || parsed.id || userEmail;
      } catch (e) {
        return userEmail;
      }
    }
    return userEmail;
  };

  // 🛠️ 2. Database se wishlist fetch karna
  const fetchWishlist = useCallback(async () => {
    const identifier = getFreshUserId();
    if (!identifier) {
      setWishlist([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/wishlist/${identifier}`);
      if (res.data.success) {
        setWishlist(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Wishlist Error:", err.message);
    }
  }, []);

  // 🛠️ 3. App Load hone par data fetch karein
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // 🛠️ 4. Toggle Logic (Add/Remove)
  const toggleWishlist = async (product) => {
    const identifier = getFreshUserId();
    
    if (!identifier) {
      alert("Please Login First! 🔐");
      return;
    }

    // Safety check product data ke liye
    const productToSend = {
      id: product.id || product._id,
      title: product.title,
      src: product.src,
      finalPrice: product.finalPrice || product.price || 0,
      category: product.category || "General"
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/wishlist/toggle`, {
        userId: identifier,
        productId: String(productToSend.id),
        productData: productToSend
      });

      if (res.data.success) {
        if (res.data.isWishlisted) {
          // Add to local state
          setWishlist((prev) => [...prev, productToSend]);
        } else {
          // Remove from local state
          setWishlist((prev) => 
            prev.filter((item) => String(item.id) !== String(productToSend.id))
          );
        }
      }
    } catch (err) {
      console.error("Toggle Error:", err.response?.data || err.message);
      alert("Backend se connect nahi ho pa raha. Check if Server is running on Port 3000!");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
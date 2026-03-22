import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster";
import Trending from "./pages/Trending";
import Goodies from "./pages/Goodies";
import MNv from "./components/Maninav";
import CartPage from "./pages/Cart";
import ImageDetails from "./pages/Details";
import User from "./pages/User";
import SearchPage from "./pages/SearchPage";
import SearchResults from "./pages/SearchResults";
import ViewOrders from "./pages/ViewOrders";
import OrderDetails from "./pages/OrderDetails";
import HomePage from "./pages/HomePage";
import LearningProductsPage from "./pages/LearningProductsPage";
import InventoryUpload from "./pages/InventoryUpload";
import AdminOrders from "./pages/AdminOrders";
import MemoryGame from './pages/MemoryGame';

import { CartProvider } from "./contexAndhooks/CartProvider";
import { CartContext } from "./contexAndhooks/CartContext";

// ---------------- SIDEBAR COMPONENT (Tailwind) ----------------
const Sidebar = ({ isOpen, onClose, navigate }) => {
  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[5000] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[5001] shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-6 flex flex-col`}>
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-[#fe3d00]">Menu</h3>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black">✖</button>
        </div>

        <nav className="flex flex-col gap-2">
          {["Sticker", "Poster", "Learning Products", "Goodies", "About", "View Order", "Account"].map((item) => (
            <div 
              key={item}
              onClick={() => { navigate(`/${item.toLowerCase().replace(" ", "-")}`); onClose(); }}
              className="p-3 text-lg font-medium text-gray-700 hover:bg-[#fff3eb] hover:text-[#fe3d00] rounded-xl cursor-pointer transition-all"
            >
              {item}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

// ---------------- PROTECTED ROUTE ----------------
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userEmail"); 
  if (!isAuthenticated) return <Navigate to="/account" replace />;
  return children;
};

function AppWrapper() {
  return (
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isGlobalLoading } = useContext(CartContext);

  const popupList = [
    { title: "🔥 Special Offer", text: "Buy 2 Stickers & Get 1 Free" },
    { title: "🚀 New Arrival", text: "Learning Products Now Available" },
    { title: "🎁 Combo Pack", text: "Special combo pack available!" },
    { title: "🎁 Free Delivery", text: "Free delivery on orders above ₹499" }
  ];

  const [popupIndex, setPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const closePopup = () => {
    if (popupIndex < popupList.length - 1) setPopupIndex(popupIndex + 1);
    else setShowPopup(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const hiddenRoutes = ["/home", "/cart", "/search", "/search-results", "/view-order","/account","/memory-game"];
  const isButtonHidden = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith("/order/") || location.pathname.startsWith("/image/");

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#fff3eb] text-[#fe3d00] text-3xl">
        Loading...
        <div className="mt-4 w-12 h-12 border-4 border-[#fe3d00] border-t-[#fff3eb] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`bg-[#fff3eb] min-h-screen transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} navigate={navigate} />

      {isGlobalLoading && (
        <div className="fixed inset-0 bg-[#fff3eb]/70 backdrop-blur-md flex flex-col justify-center items-center z-[20000]">
          <div className="w-12 h-12 border-4 border-[#fe3d00] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[#fe3d00] font-bold">Opening Cart...</p>
        </div>
      )}

      <Toaster position="top-center" containerStyle={{ zIndex: 30000 }} />
      <MNv />

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[10000] p-4">
          <div className="relative w-full max-w-sm bg-white p-8 rounded-2xl text-center shadow-2xl">
            <button className="absolute right-4 top-4 text-xl" onClick={closePopup}>✖</button>
            <h2 className="text-2xl font-bold mb-2">{popupList[popupIndex].title}</h2>
            <p className="text-gray-600 mb-6">{popupList[popupIndex].text}</p>
            <button className="bg-[#fe3d00] text-white px-8 py-2 rounded-lg font-bold" onClick={() => { navigate("/home"); setShowPopup(false); }}>
              Explore
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Trending />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/sticker" element={<Sticker />} />
        <Route path="/poster" element={<Poster />} />
        <Route path="/learning-products" element={<LearningProductsPage />} />
        <Route path="/goodies" element={<Goodies />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/image/:id" element={<ImageDetails />} />
        <Route path="/account" element={<User />} />
        <Route path="/inventory" element={<InventoryUpload />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/memory-game" element={<ProtectedRoute><MemoryGame /></ProtectedRoute>} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/view-order" element={<ViewOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="*" element={<div className="text-center mt-24 text-2xl font-bold">404 - Not Found</div>} />
      </Routes>

      {/* 🔥 CANDY FAB MENU (Tailwind) */}
{/* 🔥 UPDATED SEQUENCE: CART -> HOME -> HAMBURGER */}
{!isButtonHidden && (
  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000]">
    
    {/* 1. CART (Left Side) */}
    <div 
      onClick={() => { navigate("/cart"); setMenuOpen(false); }}
      className={`absolute flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg text-2xl cursor-pointer transition-all duration-300 ${menuOpen ? '-translate-x-20 -translate-y-12 scale-100' : 'scale-0'}`}
    >🛒</div>

    {/* 2. HOME (Top Center) */}
    <div 
      onClick={() => { navigate("/home"); setMenuOpen(false); }}
      className={`absolute flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg text-2xl cursor-pointer transition-all duration-300 ${menuOpen ? 'translate-y-[-110px] scale-100' : 'scale-0'}`}
    >🏠</div>

    {/* 3. HAMBURGER (Right Side) */}
    <div 
      onClick={() => { setIsSidebarOpen(true); setMenuOpen(false); }}
      className={`absolute flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-300 ${menuOpen ? 'translate-x-20 -translate-y-12 scale-100' : 'scale-0'}`}
    >
      <div className="flex flex-col gap-1">
        <div className="w-5 h-0.5 bg-[#fe3d00] rounded" />
        <div className="w-5 h-0.5 bg-[#fe3d00] rounded" />
        <div className="w-5 h-0.5 bg-[#fe3d00] rounded" />
      </div>
    </div>

    {/* Main FAB (Candy Box) - No Change Here */}
    <button 
      onClick={() => setMenuOpen(!menuOpen)}
      className="w-16 h-16 bg-[#fe3d00] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(254,61,0,0.5)] transition-transform active:scale-90"
    >
      <div className="grid grid-cols-2 gap-1.5 transition-transform duration-300">
        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${menuOpen ? 'rotate-45 translate-x-1.5 translate-y-1.5' : ''}`} />
        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${menuOpen ? '-rotate-45 -translate-x-1.5 translate-y-1.5' : ''}`} />
        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${menuOpen ? '-rotate-45 translate-x-1.5 -translate-y-1.5' : ''}`} />
        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${menuOpen ? 'rotate-45 -translate-x-1.5 -translate-y-1.5' : ''}`} />
      </div>
    </button>
  </div>
)}
    </div>
  );
}

export default AppWrapper;
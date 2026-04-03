import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

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
import Story from "./pages/Story";
import StickerPacks from "./pages/StickerPacks";

// NEW COMPONENT IMPORT
import PromotionalPopup from "./components/PromotionalPopup";

import { CartProvider } from "./contexAndhooks/CartProvider";
import { CartContext } from "./contexAndhooks/CartContext";

// ---------------- SIDEBAR COMPONENT ----------------
const Sidebar = ({ isOpen, onClose, navigate }) => (
  <>
    <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[5000] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose} />
    <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[5001] shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-6 flex flex-col`}>
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h3 className="text-xl font-bold text-[#fe3d00]">Menu</h3>
        <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black">✖</button>
      </div>
      <nav className="flex flex-col gap-2">
        {["EXPLORE", "Sticker Packs", "Our-story", "About", "View Order", "Account"].map((item) => (
          <div key={item} onClick={() => { navigate(`/${item.toLowerCase().replace(" ", "-")}`); onClose(); }} className="p-3 text-lg font-medium text-gray-700 hover:bg-[#fff3eb] hover:text-[#fe3d00] rounded-xl cursor-pointer transition-all">
            {item}
          </div>
        ))}
      </nav>
    </div>
  </>
);

// ---------------- PROTECTED ROUTE ----------------
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userEmail"); 
  return isAuthenticated ? children : <Navigate to="/account" replace />;
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
  const [isChecking, setIsChecking] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();
  const { isGlobalLoading } = useContext(CartContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleGameClick = () => {
    const isAuthenticated = localStorage.getItem("userEmail");
    setMenuOpen(false);
    if (!isAuthenticated) {
      toast.error("Please login to play! 🎮", {
        duration: 3000,
        style: { border: '1px solid rgba(254, 61, 0, 0.2)', padding: '8px 16px', color: '#fe3d00', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', fontSize: '14px', fontWeight: '500', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' },
      });
    } else {
      setIsChecking(true); 
      setTimeout(() => { navigate("/memory-game"); setIsChecking(false); }, 1000);
    }
  };

  const hiddenRoutes = ["/home", "/cart", "/search", "/search-results", "/view-order","/account","/memory-game","/sticker-packs"];
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
      
      {/* SCREEN BLOCKER */}
      {isChecking && <ScreenBlocker />}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} navigate={navigate} />

      {/* GLOBAL LOADER */}
      {isGlobalLoading && <GlobalLoader />}

      <Toaster position="top-center" containerStyle={{ zIndex: 40000 }} />
      <MNv />

      {/* CLEAN POPUP COMPONENT CALL */}
      <PromotionalPopup loading={loading} navigate={navigate} />

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
        <Route path="/sticker-packs" element={<StickerPacks />} />
        <Route path="/Our-story" element={<Story />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="*" element={<div className="text-center mt-24 text-2xl font-bold">404 - Not Found</div>} />
      </Routes>

      {/* FAB MENU */}
      {!isButtonHidden && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000]">
          <div onClick={handleGameClick} className={`absolute flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg text-2xl cursor-pointer transition-all duration-300 ${menuOpen ? '-translate-x-20 -translate-y-12 scale-100' : 'scale-0'}`}>🎮</div>
          <div onClick={() => { navigate("/home"); setMenuOpen(false); }} className={`absolute flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg text-2xl cursor-pointer transition-all duration-300 ${menuOpen ? 'translate-y-[-110px] scale-100' : 'scale-0'}`}>🏠</div>
          <div onClick={() => { setIsSidebarOpen(true); setMenuOpen(false); }} className={`absolute flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-300 ${menuOpen ? 'translate-x-20 -translate-y-12 scale-100' : 'scale-0'}`}>
            <div className="flex flex-col gap-1"><div className="w-5 h-0.5 bg-[#fe3d00] rounded" /><div className="w-5 h-0.5 bg-[#fe3d00] rounded" /><div className="w-5 h-0.5 bg-[#fe3d00] rounded" /></div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-16 h-16 bg-[#fe3d00] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(254,61,0,0.5)] transition-transform active:scale-90">
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

// --- HELPER COMPONENTS ---
const ScreenBlocker = () => (
  <div className="fixed inset-0 bg-[#fe3d00]/30 backdrop-blur-[3px] z-[30000] flex flex-col items-center justify-center transition-all text-white">
    <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 font-bold text-xl tracking-widest animate-pulse">CHECKING ACCESS...</p>
  </div>
);

const GlobalLoader = () => (
  <div className="fixed inset-0 bg-[#fff3eb]/70 backdrop-blur-md flex flex-col justify-center items-center z-[20000]">
    <div className="w-12 h-12 border-4 border-[#fe3d00] border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-[#fe3d00] font-bold">Opening Cart...</p>
  </div>
);

export default AppWrapper;
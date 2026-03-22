import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  const API_BASE_URL = "https://serdeptry1st.onrender.com";

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePayNow = async () => {
    setLinkLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/payment/create-link`, {
        amount: order.total,
        orderId: order.shortOrderId || order._id,
      });

      if (data.success) {
        const message = `Hello 👋, please complete the payment of ₹${order.total} for Order #${order.shortOrderId || order._id} using this secure link: ${data.short_url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
      }
    } catch (error) {
      alert("Error generating payment link.");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    const finalReason = cancelReason === "Other" ? otherReason : cancelReason;
    if (!finalReason || (cancelReason === "Other" && !otherReason.trim())) {
      return alert("Please select or provide a reason.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-orders/cancel/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: finalReason }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Cancellation request sent! Admin will review it.");
        setShowCancelModal(false);
        fetchOrder();
      }
    } catch (err) {
      alert("Error sending request.");
    } finally {
      setLoading(false);
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold animate-pulse">⌛ Loading order details...</p>
      </div>
    );

  const trackingSteps = ["Received", "Processing", "Shipped", "Delivered"];
  const cancelOptions = ["Changed my mind", "Mistakenly ordered", "Better price elsewhere", "Other"];

  return (
    <div className="bg-slate-50 min-h-screen pt-20 px-4 pb-10">
      <h2 className="text-center text-3xl font-extrabold mb-8 text-slate-800">📦 Order Tracking</h2>

      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl shadow-slate-200/60 border border-slate-100">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</p>
            <span className="font-black text-orange-600 text-lg">#{order.shortOrderId || order._id}</span>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black border ${order.paymentStatus === "Paid" ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
              {order.paymentStatus === "Paid" ? "PAID ✅" : "UNPAID ⏳"}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Placed On</p>
            <span className="text-sm font-bold text-slate-600">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* --- Products List --- */}
        <h4 className="mb-4 text-lg font-extrabold text-slate-800">Items Ordered:</h4>
        <div className="space-y-4">
          {order.products.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-white shadow-sm" />
              <div className="flex-1">
                <p className="font-bold text-slate-800 leading-tight">{item.title}</p>
                <p className="text-sm text-slate-500 font-semibold mt-1">₹{item.price} × {item.quantity}</p>
              </div>
              <p className="font-black text-orange-600">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* --- Totals Section --- */}
        <div className="mt-6 text-right bg-slate-900 text-white p-6 rounded-3xl shadow-lg shadow-slate-200">
          <p className="text-sm text-slate-400">Subtotal: <strong className="text-white">₹{order.subtotal}</strong></p>
          {order.discount > 0 && <p className="text-sm text-emerald-400 font-bold mt-1">Discount Applied: -{order.discount}%</p>}
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            {order.paymentStatus === "Paid" ? (
              <h5 className="text-2xl font-black text-emerald-400">Amount Paid: ₹{order.total}</h5>
            ) : (
              <div className="flex flex-col items-end gap-3">
                <h5 className="text-2xl font-black text-orange-500">Total Payable: ₹{order.total}</h5>
                <button 
                  onClick={handlePayNow}
                  disabled={linkLoading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {linkLoading ? "Generating..." : "📤 Pay via WhatsApp Link"}
                </button>
              </div>
            )}
          </div>
        </div>

        <hr className="my-8 opacity-50" />

        {/* --- Delivery Address --- */}
        <h4 className="mb-4 text-lg font-extrabold text-slate-800">📍 Shipping To:</h4>
        {order.address ? (
          <div className="bg-orange-50/50 p-5 rounded-2xl border-2 border-dashed border-orange-200">
            <p className="font-black text-lg text-slate-800">{order.address.fullName}</p>
            <p className="text-orange-600 font-bold mt-1">📞 +91 {order.address.phone}</p>
            <p className="text-slate-600 font-medium mt-2 leading-relaxed">
              {order.address.street}, {order.address.city}, {order.address.state} - <strong className="text-slate-900">{order.address.pincode}</strong>
            </p>
          </div>
        ) : (
          <p className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">Address details not found.</p>
        )}

        <hr className="my-8 opacity-50" />

        {/* --- Tracking Status UI & Cancel --- */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-extrabold text-slate-800">🚚 Order Status:</h4>
          {order.orderStatus !== "Cancelled" && 
           order.orderStatus !== "Delivered" && 
           order.orderStatus !== "Shipped" && 
           order.orderStatus !== "Cancel Requested" && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="bg-white border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-all"
            >
              Request Cancellation
            </button>
          )}
        </div>
        
        {order.orderStatus === "Cancelled" ? (
          <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="font-black">Order Cancelled</span>
            </div>
            {order.cancelReason && <p className="mt-2 text-sm text-rose-500/80 italic font-medium">Reason: {order.cancelReason}</p>}
          </div>
        ) : order.orderStatus === "Cancel Requested" ? (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-600">
             <p className="font-black flex items-center gap-2">⏳ Cancellation Pending</p>
             <p className="mt-1 text-sm font-medium opacity-80">Admin is reviewing your request for: "{order.cancelReason}"</p>
          </div>
        ) : (
          <div className="space-y-6 ml-2">
            {trackingSteps.map((step, index) => {
              const currentStatusIndex = trackingSteps.indexOf(order.orderStatus);
              const thisStepIndex = trackingSteps.indexOf(step);
              const isActive = thisStepIndex <= currentStatusIndex;
              const colors = { Received: "bg-blue-500", Processing: "bg-amber-500", Shipped: "bg-orange-500", Delivered: "bg-emerald-500" };

              return (
                <div key={step} className="flex gap-4 relative">
                  {index !== trackingSteps.length - 1 && (
                    <div className={`absolute left-[7px] top-4 w-0.5 h-10 ${isActive && (thisStepIndex < currentStatusIndex) ? colors[step] : 'bg-slate-100'}`} />
                  )}
                  <div className={`z-10 w-4 h-4 rounded-full mt-1.5 transition-all duration-500 ${isActive ? `${colors[step]} shadow-lg` : 'bg-slate-200'}`} />
                  <div className={`transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                    <span className={`font-black text-sm uppercase tracking-wide ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
                    {step === order.orderStatus && <span className="ml-3 text-[9px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Current</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Cancel Modal --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Cancel Request</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Please tell us why you'd like to cancel.</p>
            
            <select 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500 mb-4 font-bold text-slate-700"
            >
              <option value="">-- Choose a reason --</option>
              {cancelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            {cancelReason === "Other" && (
              <textarea 
                placeholder="Describe reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full h-24 p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500 mb-4 font-medium resize-none"
              />
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">Close</button>
              <button onClick={handleCancelRequest} disabled={loading} className="flex-1 py-4 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30">
                {loading ? "Sending..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-center mt-8 text-slate-400 text-sm font-bold">
        Need help? Contact support with your Order ID.
      </p>
    </div>
  );
}
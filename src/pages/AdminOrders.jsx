import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const navigate = useNavigate(); // 🔥 Initialize navigate
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const API_BASE_URL = "https://serdeptry1st.onrender.com/api/customer-orders";
  const statusOptions = ["Pending", "Received", "Processing", "Shipped", "Delivered", "Cancelled"];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      const result = await res.json();
      const data = result.orders || result.data || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = orders.filter(order =>
      (order.shortOrderId && order.shortOrderId.toLowerCase().includes(term)) ||
      (order.userName && order.userName.toLowerCase().includes(term)) ||
      (order.userEmail && order.userEmail.toLowerCase().includes(term))
    );
    setFilteredOrders(filtered);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Order status updated to: " + newStatus);
        const updated = orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o);
        setOrders(updated);
        setFilteredOrders(updated);
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (err) {
      alert("Error: Server not responding.");
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f4f6f9', padding: '20px', minHeight: '100vh' }}>
      {/* Back Button for UX */}
      <button onClick={() => navigate(-1)} style={{marginBottom: '10px', cursor: 'pointer', background: '#ccc', border: 'none', padding: '5px 15px', borderRadius: '4px'}}>← Back</button>
      
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        📦 Admin Order Tracking Panel
      </h2>

      <div style={styles.topBar}>
        <div style={styles.count}>Total Orders: <span>{filteredOrders.length}</span></div>
        <input 
          type="text" 
          style={styles.searchInput} 
          placeholder="Search by Order ID or Name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button style={styles.btn} onClick={handleSearch}>🔍 Search</button>
        <button style={styles.btn} onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div style={styles.loader}>Loading orders...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Delivery Address</th>
                <th style={styles.th}>Products</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Cancellation</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 'bold', color: '#fe3d00' }}>{order.shortOrderId || 'N/A'}</td>
                  <td style={styles.td}>
                    <strong>{order.userName}</strong><br />
                    <small style={{ color: '#666' }}>{order.userEmail}</small>
                  </td>
                  <td style={styles.td}>
                    {order.address ? (
                      <div style={styles.addressBox}>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>{order.address.fullName || order.userName}</span>
                        📞 {order.address.phone}<br />
                        📍 {order.address.street}, {order.address.city}<br />
                        {order.address.state} - {order.address.pincode}
                      </div>
                    ) : (
                      <span style={{ color: 'red', fontStyle: 'italic' }}>No Address</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {order.products.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <img src={p.image} style={styles.productImg} alt="" />
                        <span style={{ fontSize: '0.85rem' }}><strong>{p.quantity}x</strong> {p.title}</span>
                      </div>
                    ))}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>₹{order.total}</td>
                  <td style={styles.td}>
                    <small>{new Date(order.createdAt).toLocaleString('en-IN')}</small>
                  </td>
                  <td style={styles.td}>
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td style={styles.td}>
                    {(order.cancelReason || order.reason) ? (
                      <div style={styles.queryBox}>
                        <span style={styles.reasonLabel}>User Requested:</span>
                        {order.cancelReason || order.reason}
                      </div>
                    ) : (
                      <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.85rem' }}>No active requests</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 🔥 Corrected Styles Object
const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  btn: { padding: '10px 18px', background: '#fe3d00', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  searchInput: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flexGrow: 1, minWidth: '250px' },
  count: { fontWeight: 'bold', fontSize: '1.1rem' },
  loader: { textAlign: 'center', marginTop: '30px', fontWeight: 'bold', color: '#666' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  th: { background: '#000', color: 'white', padding: '14px', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.85rem' },
  td: { padding: '14px', borderBottom: '1px solid #eee', verticalAlign: 'top' },
  productImg: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', marginRight: '10px', border: '1px solid #ddd' }, // 🔥 Fixed objectFit
  statusSelect: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #fe3d00', cursor: 'pointer', fontWeight: '600', outline: 'none' },
  addressBox: { fontSize: '0.9rem', lineHeight: '1.4', color: '#444', background: '#fdfdfd', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #fe3d00' },
  queryBox: { fontSize: '0.85rem', padding: '10px', borderRadius: '8px', background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', maxWidth: '220px' },
  reasonLabel: { fontWeight: '800', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '4px', color: '#e53e3e' },
};
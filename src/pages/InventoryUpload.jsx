import React, { useState, useEffect } from "react";

// 🔥 Dynamic API URL
const API = window.location.hostname === "localhost" 
  ? "http://localhost:3000/api/products" 
  : "https://serdeptry1st.onrender.com/api/products";

export default function InventoryUpload() {
  const [inventory, setInventory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Multi-file state (Purani states ki jagah ye naya system)
  const [tempFiles, setTempFiles] = useState([]); // Array of { file, preview, role: 'main' | 'sub' }

  const [formData, setFormData] = useState({
    id: "",
    pageType: "stickerData",
    category: "",
    title: "Sticker",
    shortDesc: "Maximum 6*6 cm2",
    longDesc: "",
    finalPrice: 29,
    originalPrice: 99,
    discount: 0,
    rating: 4.5,
    stock: 10,
    src: "", 
    badge: "Hot",
    subImages: "", 
    tags: "",
  });

  const loadInventory = async () => {
    try {
      const res = await fetch(`${API}/${formData.pageType}`);
      const data = await res.json();
      setInventory(data);
    } catch (e) { console.error("Server Offline", e); }
  };

  useEffect(() => { loadInventory(); }, [formData.pageType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 🔥 Multi-file Selection Logic (Refined)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      role: index === 0 && tempFiles.length === 0 ? "main" : "sub", 
    }));
    setTempFiles([...tempFiles, ...newFiles]);
    setFormData({ ...formData, src: "" }); // Agar file select ki to manual URL clear
  };

  const removeFile = (index) => {
    const updated = tempFiles.filter((_, i) => i !== index);
    setTempFiles(updated);
  };

  const setRole = (index, role) => {
    const updated = tempFiles.map((item, i) => {
      if (role === "main") {
        return { ...item, role: i === index ? "main" : "sub" };
      }
      return i === index ? { ...item, role } : item;
    });
    setTempFiles(updated);
  };

  const resetForm = () => {
    setFormData({
      id: "", pageType: "stickerData", category: "", title: "Sticker",
      shortDesc: "Maximum 6*6 cm2", longDesc: "", finalPrice: 29,
      originalPrice: 99, discount: 0, rating: 4.5, stock: 10,
      src: "", badge: "Hot", subImages: "", tags: "",
    });
    setTempFiles([]);
    setIsEditing(false);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSend = new FormData();
      
      // Basic Fields append karna (id chhod ke)
      Object.keys(formData).forEach((key) => {
        if (key !== "id") dataToSend.append(key, formData[key]);
      });

      // 🔥 Files Logic: Kaunsi file kis field mein jayegi
      const mainFile = tempFiles.find(f => f.role === "main");
      const subFiles = tempFiles.filter(f => f.role === "sub");

      if (mainFile) dataToSend.append("image", mainFile.file);
      subFiles.forEach((f) => dataToSend.append("subImages", f.file));

      const endpoint = formData.id ? `${API}/update/${formData.id}` : `${API}/add`;
      const method = formData.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method: method,
        body: dataToSend,
      });

      const result = await res.json();
      if (result.success) {
        alert(formData.id ? "Update Success!" : "Added Success!");
        resetForm();
        loadInventory();
      } else {
        alert("Server Error: " + result.message);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error! Check Console.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsEditing(true);
    setFormData({
      id: item._id,
      pageType: item.pageType,
      category: item.category || "",
      title: item.title,
      shortDesc: item.shortDesc || "",
      longDesc: item.longDesc || "",
      finalPrice: item.finalPrice,
      originalPrice: item.originalPrice,
      discount: item.discount || 0,
      rating: item.rating,
      stock: item.stock,
      src: item.src,
      badge: item.badge || "",
      subImages: (item.subImages || []).join(", "),
      tags: (item.tags || []).join(", "),
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) loadInventory();
    } catch (err) { alert("Delete failed!"); }
  };

  return (
    <div className="bg-[#0f172a] text-slate-200 p-5 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-5">
          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700 sticky top-5">
            <h1 className="text-3xl font-extrabold text-yellow-500 mb-6 uppercase tracking-wider">
              {isEditing ? "Edit Product 🛠️" : "Add New Product"}
            </h1>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Page</label>
                <select id="pageType" value={formData.pageType} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none focus:ring-1 focus:ring-yellow-500">
                  <option value="trendingData">Trending (tr-)</option>
                  <option value="stickerData">Stickers (st-)</option>
                  <option value="posterData">Posters (pos-)</option>
                  <option value="goodiesData">Goodies (gies-)</option>
                </select>
              </div>

              {/* 🔥 REFINED: Local File Upload UI */}
              <div className="p-4 bg-[#0f172a] border border-dashed border-slate-700 rounded-lg">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Upload Local Images (Multi)</label>
                <input 
                  id="file-upload"
                  type="file" 
                  multiple
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                />
                
                {/* Image Previews with Role Selection */}
                {tempFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {tempFiles.map((item, index) => (
                      <div key={index} className={`relative p-1 rounded border ${item.role === 'main' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-800'}`}>
                        <img src={item.preview} className="h-16 w-full object-cover rounded" alt="p" />
                        <div className="flex flex-col gap-1 mt-1">
                          <button onClick={() => setRole(index, 'main')} className={`text-[7px] p-1 font-bold rounded ${item.role === 'main' ? 'bg-yellow-500 text-black' : 'bg-slate-700'}`}>
                            {item.role === 'main' ? 'MAIN' : 'SET MAIN'}
                          </button>
                          <button onClick={() => removeFile(index)} className="text-[7px] p-1 bg-red-600/20 text-red-400 rounded">REMOVE</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center text-slate-600 font-bold text-[10px]">-- OR --</div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Title</label>
                  <input type="text" id="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none focus:border-yellow-500" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Label</label>
                  <input type="text" id="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Badge</label>
                  <input type="text" id="badge" value={formData.badge} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Final ₹</label>
                  <input type="number" id="finalPrice" value={formData.finalPrice} onChange={handleChange} className="w-full p-2 bg-[#0f172a] rounded border border-slate-700 outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Orig ₹</label>
                  <input type="number" id="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full p-2 bg-[#0f172a] rounded border border-slate-700 outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Disc %</label>
                  <input type="number" id="discount" value={formData.discount} onChange={handleChange} className="w-full p-2 bg-[#0f172a] rounded border border-slate-700 outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Rate</label>
                  <input type="number" step="0.1" id="rating" value={formData.rating} onChange={handleChange} className="w-full p-2 bg-[#0f172a] rounded border border-slate-700 outline-none" />
                </div>
              </div>

              <textarea id="shortDesc" value={formData.shortDesc} onChange={handleChange} placeholder="Short Description" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none h-14" />
              <textarea id="longDesc" value={formData.longDesc} onChange={handleChange} placeholder="Long Detailed Description..." className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none h-24" />

              <input type="text" id="src" value={formData.src} onChange={handleChange} placeholder="Method 2: Main Image URL" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none focus:border-yellow-500" />
              <textarea id="subImages" value={formData.subImages} onChange={handleChange} placeholder="Gallery URLs (comma separated)" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none h-16 text-xs" />
              <input type="text" id="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none text-xs" />

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all shadow-xl uppercase disabled:bg-slate-600"
                >
                  {loading ? "Processing..." : isEditing ? "Update Changes 🛠️" : "Add Product 🚀"}
                </button>
                {isEditing && (
                  <button onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 px-6 rounded-xl font-bold">Cancel</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Section (Unchanged) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-400">Inventory Explorer</h2>
              <span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-yellow-500 font-bold">{inventory.length} Items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <div key={item._id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 group relative">
                    <img src={item.src} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-3 shadow-lg" />
                    <h4 className="text-sm font-bold truncate">{item.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-yellow-500 font-bold text-xs">₹{item.finalPrice}</span>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(item)} className="p-2 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold">EDIT</button>
                        <button onClick={() => deleteItem(item._id)} className="p-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600 hover:text-white transition-all text-[10px] font-bold">DEL</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-slate-600 py-10 italic">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
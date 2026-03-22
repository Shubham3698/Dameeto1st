import React, { useState, useEffect } from "react";

// 🔥 Dynamic API URL
const API = window.location.hostname === "localhost" 
  ? "http://localhost:3000/api/products" 
  : "https://serdeptry1st.onrender.com/api/products";

export default function InventoryUpload() {
  const [inventory, setInventory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempFiles, setTempFiles] = useState([]); 

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
    removeBg: false, // 🔥 New AI Feature
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
    const { id, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [id]: type === "checkbox" ? checked : value 
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 15 * 1024 * 1024) {
        alert(`File "${file.name}" is too large! Max 15MB.`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      role: index === 0 && tempFiles.length === 0 ? "main" : "sub", 
    }));

    setTempFiles([...tempFiles, ...newFiles]);
    setFormData({ ...formData, src: "" });
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
      src: "", badge: "Hot", subImages: "", tags: "", removeBg: false,
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
      
      // 1. AI Background Removal logic
      const mainFileObj = tempFiles.find(f => f.role === "main");
      let mainFileToUpload = mainFileObj ? mainFileObj.file : null;

      if (formData.removeBg && mainFileToUpload) {
        const aiFormData = new FormData();
        aiFormData.append("image_file", mainFileToUpload);
        aiFormData.append("size", "auto");

        const aiRes = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: { "X-Api-Key": "RXuK8dw7KH4zrFWZA1FYj3f6" }, 
          body: aiFormData,
        });

        if (aiRes.ok) {
          const blob = await aiRes.blob();
          mainFileToUpload = new File([blob], "cleaned_image.png", { type: "image/png" });
        }
      }

      // 2. Append ALL Data Fields (Restore all missing fields)
      Object.keys(formData).forEach((key) => {
        if (key !== "id") dataToSend.append(key, formData[key]);
      });

      // 3. Append Main Image & SubImages
      if (mainFileToUpload) dataToSend.append("image", mainFileToUpload);
      const subFiles = tempFiles.filter(f => f.role === "sub");
      subFiles.forEach((f) => dataToSend.append("subImages", f.file));

      const endpoint = formData.id ? `${API}/update/${formData.id}` : `${API}/add`;
      const method = formData.id ? "PUT" : "POST";

      const res = await fetch(endpoint, { method, body: dataToSend });
      const result = await res.json();
      if (result.success) {
        alert("Action Successful! 🚀");
        resetForm();
        loadInventory();
      }
    } catch (err) { 
      console.error(err); 
      alert("Error occurred. Check console.");
    } finally { setLoading(false); }
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
      stock: item.stock || 10,
      src: item.src,
      badge: item.badge || "",
      removeBg: item.removeBg || false,
      // Fix array-to-string conversion for subImages and tags
      subImages: Array.isArray(item.subImages) ? item.subImages.join(", ") : (item.subImages || ""),
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-black text-yellow-500 uppercase tracking-tight">
                {isEditing ? "Edit Item 🛠️" : "New Entry 🚀"}
              </h1>
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-yellow-500 transition-colors uppercase tracking-widest">AI Clean BG</span>
                <input type="checkbox" id="removeBg" checked={formData.removeBg} onChange={handleChange} className="w-4 h-4 accent-yellow-500 cursor-pointer" />
              </label>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Page</label>
                  <select id="pageType" value={formData.pageType} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none text-slate-300">
                    <option value="trendingData">Trending</option>
                    <option value="stickerData">Stickers</option>
                    <option value="posterData">Posters</option>
                    <option value="goodiesData">Goodies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stock Amount</label>
                  <input type="number" id="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none" />
                </div>
              </div>

              <div className="p-4 bg-[#0f172a] border border-dashed border-slate-700 rounded-xl">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Upload Files</label>
                <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileSelect} className="w-full text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer" />
                
                {tempFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {tempFiles.map((item, index) => (
                      <div key={index} className={`relative p-1 rounded-lg border bg-white overflow-hidden ${item.role === 'main' ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-slate-200'}`}>
                        <img src={item.preview} className={`h-16 w-full object-contain ${formData.removeBg && item.role === 'main' ? 'mix-blend-multiply' : ''}`} alt="p" />
                        <div className="flex flex-col gap-1 mt-1">
                          <button onClick={() => setRole(index, 'main')} className={`text-[7px] p-1 font-bold rounded ${item.role === 'main' ? 'bg-yellow-500 text-black' : 'bg-slate-200 text-slate-700'}`}>MAIN</button>
                          <button onClick={() => removeFile(index)} className="text-[7px] p-1 bg-red-50 text-red-500 rounded font-bold uppercase">Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
                  <input type="text" id="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none" required />
                </div>
                <input type="text" id="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none" />
                <input type="text" id="badge" value={formData.badge} onChange={handleChange} placeholder="Badge (Hot/New)" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 outline-none" />
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs">
                {["finalPrice", "originalPrice", "discount", "rating"].map((field) => (
                  <div key={field}>
                    <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">{field}</label>
                    <input type="number" step={field === "rating" ? "0.1" : "1"} id={field} value={formData[field]} onChange={handleChange} className="w-full p-2 bg-[#0f172a] rounded border border-slate-700" />
                  </div>
                ))}
              </div>

              <textarea id="shortDesc" value={formData.shortDesc} onChange={handleChange} placeholder="Short Description" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 h-14" />
              <textarea id="longDesc" value={formData.longDesc} onChange={handleChange} placeholder="Long Detailed Description..." className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 h-24" />

              {/* RESTORED MISSING FIELDS BELOW */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">External Sources & Metadata</label>
                <input type="text" id="src" value={formData.src} onChange={handleChange} placeholder="OR: Manual Image URL" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 text-xs" />
                <textarea id="subImages" value={formData.subImages} onChange={handleChange} placeholder="Manual Gallery URLs (comma separated)" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 h-14 text-xs" />
                <input type="text" id="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-3 bg-[#0f172a] rounded-lg border border-slate-700 text-xs" />
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-xl shadow-xl uppercase disabled:bg-slate-600">
                  {loading ? "Processing..." : isEditing ? "Update Item 🛠️" : "Deploy Item 🚀"}
                </button>
                {isEditing && (
                  <button onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 px-6 rounded-xl font-bold">Cancel</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-400 mb-6">Inventory Explorer ({inventory.length} Items)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
              {inventory.map((item) => (
                <div key={item._id} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-all">
                  <div className={`w-full h-44 rounded-xl mb-3 overflow-hidden relative ${item.removeBg ? 'bg-white p-2' : 'bg-slate-800'}`}>
                    <img src={item.src} alt={item.title} className={`w-full h-full transition-all duration-500 ${item.removeBg ? 'object-contain mix-blend-multiply' : 'object-cover'}`} />
                  </div>
                  <h4 className="text-sm font-bold truncate text-slate-200">{item.title}</h4>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-col">
                      <span className="text-yellow-500 font-black text-sm">₹{item.finalPrice}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Stock: {item.stock}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-bold uppercase hover:bg-blue-500 hover:text-white transition-all">Edit</button>
                      <button onClick={() => deleteItem(item._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg text-[9px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";

export default function StickerAdmin({ onClose, API_BASE_URL }) {
  const [tempFiles, setTempFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (tempFiles.length + files.length > 12) {
      alert("Sirf 12 stickers hi allowed hain!");
      return;
    }
    const newFiles = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setTempFiles([...tempFiles, ...newFiles]);
  };

  const handleUploadAll = async () => {
    if (tempFiles.length !== 12) {
      alert(`Pehle 12 select karein! (Selected: ${tempFiles.length})`);
      return;
    }
    setLoading(true);
    try {
      for (const item of tempFiles) {
        const data = new FormData();
        data.append("image", item.file);
        const res = await fetch(`${API_BASE_URL}/api/upload-sticker`, { method: "POST", body: data });
        const result = await res.json();
        if (!result.success) throw new Error("Upload failed");
      }
      alert("12 Stickers Updated! Refreshing...");
      window.location.reload();
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const s = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    card: { background: '#1e293b', width: '90%', maxWidth: '400px', borderRadius: '15px', padding: '20px', border: '1px solid #fe3d00' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', margin: '15px 0' },
    img: { width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '5px', border: '1px solid #334155' }
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <h3 style={{color: '#fe3d00', marginTop: 0}}>STICKER ADMIN</h3>
        <label style={{display:'block', padding:'20px', border:'1px dashed #475569', textAlign:'center', cursor:'pointer', background:'#0f172a'}}>
          <span style={{fontSize:'12px', color:'#94a3b8'}}>📁 Select 12 Stickers</span>
          <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{display:'none'}} />
        </label>
        <div style={s.grid}>
          {tempFiles.map((f, i) => <img key={i} src={f.preview} style={s.img} />)}
          {[...Array(Math.max(0, 12 - tempFiles.length))].map((_, i) => (
            <div key={i} style={{...s.img, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#475569'}}>{tempFiles.length+i+1}</div>
          ))}
        </div>
        <button onClick={handleUploadAll} disabled={loading} style={{width:'100%', padding:'12px', background:'#fe3d00', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>
          {loading ? "UPLOADING..." : "CONFIRM 12 STICKERS"}
        </button>
        <button onClick={onClose} style={{width:'100%', marginTop:'10px', background:'none', border:'none', color:'#64748b', cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  );
}
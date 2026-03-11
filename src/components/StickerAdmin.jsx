import React, { useState, useEffect, useCallback } from "react";

export default function StickerAdmin({ onClose, API_BASE_URL }) {
  const [tab, setTab] = useState("upload"); // upload, manage, edit
  const [tempFiles, setTempFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("BGMI");
  const [groups, setGroups] = useState([]);
  const [selectedGroupItems, setSelectedGroupItems] = useState([]);
  const [viewingGroup, setViewingGroup] = useState("");

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/manage-groups`);
      const data = await res.json();
      if (data.success) setGroups(data.groups);
    } catch (err) { console.error("Fetch Groups Error:", err); }
  }, [API_BASE_URL]);

  const fetchGroupDetails = useCallback(async (catName) => {
    setLoading(true);
    setViewingGroup(catName);
    try {
      const res = await fetch(`${API_BASE_URL}/api/group-details/${catName}`);
      const data = await res.json();
      if (data.success) {
        setSelectedGroupItems(data.stickers);
        setTab("edit");
      }
    } catch (err) { console.error("Fetch Details Error:", err); }
    finally { setLoading(false); }
  }, [API_BASE_URL]);

  useEffect(() => { 
    if (tab === "manage") fetchGroups(); 
  }, [tab, fetchGroups]);

  // --- DELETE FULL GROUP ---
  const deleteFullGroup = async (catName) => {
    if (!window.confirm(`Kya aap poora "${catName}" group delete karna chahte hain?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/delete-group/${catName}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchGroups(); // List refresh karein
    } catch (err) { console.error("Delete Group Error:", err); }
  };

  const deleteSingleSticker = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/delete-sticker/${id}`, { method: "DELETE" });
      fetchGroupDetails(viewingGroup); 
    } catch (err) { console.error("Delete Error:", err); }
  };

  const handleUpload = async (targetCategory = category) => {
    if (tempFiles.length === 0) return alert("Select images first!");
    setLoading(true);
    try {
      for (let f of tempFiles) {
        const d = new FormData();
        d.append("image", f.file);
        d.append("category", targetCategory.trim().toUpperCase());
        await fetch(`${API_BASE_URL}/api/upload-sticker`, { method: "POST", body: d });
      }
      setTempFiles([]);
      if (tab === "edit") fetchGroupDetails(targetCategory);
      else setTab("manage");
    } catch (err) { alert("Upload failed!"); }
    finally { setLoading(false); }
  };

  const s = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    card: { background: '#1e293b', width: '90%', maxWidth: '480px', borderRadius: '20px', padding: '20px', border: '1px solid #fe3d00', color: 'white', maxHeight: '90vh', overflowY: 'auto' },
    tabRow: { display: 'flex', marginBottom: '20px', border: '1px solid #fe3d00', borderRadius: '8px', overflow: 'hidden' },
    btn: (active) => ({ flex: 1, padding: '10px', background: active ? '#fe3d00' : '#0f172a', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }),
    actionBtn: (color) => ({ background: color, border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '15px 0' },
    imgBox: { position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        {tab !== "edit" && (
          <div style={s.tabRow}>
            <button onClick={() => setTab("upload")} style={s.btn(tab === "upload")}>UPLOAD</button>
            <button onClick={() => setTab("manage")} style={s.btn(tab === "manage")}>GROUPS</button>
          </div>
        )}

        {tab === "upload" && (
          <div>
            <input style={{width:'100%', padding:'12px', background:'#0f172a', color:'white', border:'1px solid #334155', marginBottom:'10px', borderRadius:'8px'}} value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="GROUP NAME (e.g. BGMI)"/>
            <input type="file" multiple onChange={(e)=>setTempFiles(Array.from(e.target.files).map(f=>({file:f, preview:URL.createObjectURL(f)})))} />
            <div style={s.grid}>{tempFiles.map((f,i)=><img key={i} src={f.preview} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'8px'}} alt="p"/>)}</div>
            <button onClick={()=>handleUpload()} disabled={loading} style={{width:'100%', padding:'12px', background:'#fe3d00', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>{loading ? "UPLOADING..." : "SAVE GROUP"}</button>
          </div>
        )}

        {tab === "manage" && (
          <div>
            {groups.length === 0 && <p style={{textAlign:'center', color:'#64748b'}}>No groups found.</p>}
            {groups.map((g, i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0f172a', padding:'12px', marginBottom:'10px', borderRadius:'10px', border:'1px solid #334155'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <img src={g.preview} style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'5px'}} alt="p"/>
                  <span style={{fontWeight:'bold'}}>{g.name}</span>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                  <button onClick={()=>fetchGroupDetails(g.name)} style={s.actionBtn('#fe3d00')}>Edit</button>
                  <button onClick={()=>deleteFullGroup(g.name)} style={s.actionBtn('#ef4444')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "edit" && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', alignItems:'center'}}>
              <h3 style={{color:'#fe3d00', margin:0}}>Group: {viewingGroup}</h3>
              <button onClick={()=>setTab("manage")} style={{background:'none', border:'1px solid #475569', color:'#94a3b8', cursor:'pointer', padding:'4px 10px', borderRadius:'5px'}}>Back</button>
            </div>
            
            <div style={{background:'#0f172a', padding:'10px', borderRadius:'10px', marginBottom:'20px', border:'1px solid #334155'}}>
              <p style={{fontSize:'12px', margin:'0 0 10px 0', color:'#94a3b8'}}>Add images to {viewingGroup}:</p>
              <input type="file" multiple onChange={(e)=>setTempFiles(Array.from(e.target.files).map(f=>({file:f, preview:URL.createObjectURL(f)})))} />
              {tempFiles.length > 0 && <button onClick={()=>handleUpload(viewingGroup)} style={{width:'100%', marginTop:'10px', background:'#22c55e', border:'none', color:'white', padding:'8px', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>Upload New Items</button>}
            </div>

            <div style={s.grid}>
              {selectedGroupItems.map((img) => (
                <div key={img._id} style={s.imgBox}>
                  <img src={img.url} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="s"/>
                  <button onClick={()=>deleteSingleSticker(img._id)} style={{position:'absolute', top:2, right:2, background:'#ef4444', color:'white', border:'none', borderRadius:'50%', width:'22px', height:'22px', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} style={{width:'100%', marginTop:'20px', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'13px'}}>Close Admin Panel</button>
      </div>
    </div>
  );
}
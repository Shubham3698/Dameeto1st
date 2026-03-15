import React, { useState, useEffect } from "react";
import { Button, Form, Image, Tabs, Tab } from "react-bootstrap";
import GiftCarousel from "./FreeGiftCarousel"; 

const GiftUploadModal = ({ onClose, API_BASE_URL }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allGifts, setAllGifts] = useState([]);
  const [key, setKey] = useState('upload');
  
  // 🔥 Edit States
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [editImage, setEditImage] = useState(null); // Nayi image ke liye

  const apiBase = API_BASE_URL.replace('/customer-orders', '') + "/free-gifts";

  const fetchGifts = async () => {
    try {
      const res = await fetch(`${apiBase}/get-all`);
      const data = await res.json();
      if (data.success) setAllGifts(data.gifts);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (key === 'manage') fetchGifts(); }, [key]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Select image");
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("image", image);

    try {
      const res = await fetch(`${apiBase}/upload`, { method: "POST", body: data });
      const result = await res.json();
      if (result.success) { alert("Gift Added!"); setKey('manage'); fetchGifts(); }
    } catch (err) { alert("Failed"); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gift?")) return;
    try {
      const res = await fetch(`${apiBase}/delete/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) { alert("Deleted!"); fetchGifts(); }
    } catch (err) { alert("Failed"); }
  };

  // 🔥 Edit Logic with Image Support
  const startEditing = (gift) => {
    setEditingId(gift._id);
    setEditData({ title: gift.title, description: gift.description || "" });
    setEditImage(null); // Reset image selection
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    const data = new FormData();
    data.append("title", editData.title);
    data.append("description", editData.description);
    if (editImage) data.append("image", editImage); // Nayi image agar select ki ho

    try {
      const res = await fetch(`${apiBase}/edit/${id}`, {
        method: "PUT",
        body: data, // No headers needed for FormData
      });
      const result = await res.json();
      if (result.success) {
        alert("Updated Successfully! 🎉");
        setEditingId(null);
        fetchGifts();
      }
    } catch (err) { 
      alert("Update failed"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', width: '95%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 style={{ color: '#fe3d00', fontWeight: '800', margin: 0 }}>🎁 Gift Settings</h4>
          <Button variant="link" onClick={onClose} style={{ color: '#000', textDecoration: 'none', fontWeight: '800' }}>X</Button>
        </div>

        <Tabs activeKey={key} onSelect={(k) => { setKey(k); setEditingId(null); }} className="mb-4 custom-tabs">
          <Tab eventKey="upload" title="Upload">
            <div className="mt-3">
              <GiftCarousel subtotal={0} cartItems={[]} onAddGift={()=>{}} onRemoveGift={()=>{}} />
              <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Control className="mb-3" type="text" placeholder="Title" required onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <Form.Control className="mb-3" as="textarea" placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <Form.Control className="mb-4" type="file" accept="image/*" required onChange={(e) => setImage(e.target.files[0])} />
                <Button type="submit" disabled={loading} style={{ width: '100%', background: '#fe3d00', border: 'none', padding: '12px', fontWeight: '700', borderRadius: '12px' }}>
                  {loading ? "Uploading..." : "Save Gift"}
                </Button>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="manage" title="Manage">
            <div className="mt-3">
              {allGifts.map((gift) => (
                <div key={gift._id} className="p-3 mb-3" style={{ border: '1px solid #eee', borderRadius: '15px', background: '#f9f9f9' }}>
                  <div className="d-flex align-items-start mb-2">
                    <div style={{ position: 'relative' }}>
                      <Image src={gift.src} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '12px' }} />
                      {editingId === gift._id && <div style={{ fontSize: '10px', textAlign: 'center', color: '#fe3d00', fontWeight: '700' }}>New Image?</div>}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      {editingId === gift._id ? (
                        <div className="d-flex flex-column gap-2">
                          <Form.Control size="sm" value={editData.title} placeholder="New Title" onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                          <Form.Control size="sm" as="textarea" rows={1} value={editData.description} placeholder="New Description" onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                          <Form.Control size="sm" type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
                        </div>
                      ) : (
                        <div>
                          <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{gift.title}</h6>
                          <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>{gift.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    {editingId === gift._id ? (
                      <>
                        <Button variant="success" size="sm" disabled={loading} onClick={() => handleUpdate(gift._id)}>
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline-primary" size="sm" onClick={() => startEditing(gift)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(gift._id)}>Delete</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
      <style>{`.custom-tabs .nav-link { color: #666; font-weight: 700; border: none; } .custom-tabs .nav-link.active { color: #fe3d00 !important; border-bottom: 3px solid #fe3d00 !important; }`}</style>
    </div>
  );
};
export default GiftUploadModal;
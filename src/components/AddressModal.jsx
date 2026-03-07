import React, { useState } from "react";
import { Modal, Button, Form, ProgressBar, Spinner, Row, Col } from "react-bootstrap";

export default function AddressModal({ show, handleClose, handleSave }) {
  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "",
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value.length > 10) return;
    if (name === "pincode" && value.length > 6) return;
    setAddress({ ...address, [name]: value });
  };

  const nextStep = async () => {
    if (step === 1) {
      if (!address.fullName || !address.phone) return alert("Please enter name and phone.");
      if (!/^[6-9]\d{9}$/.test(address.phone)) return alert("Invalid Indian phone number!");
      setIsValidating(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      setStep(2);
      setIsValidating(false);
    }
  };

  const handleSubmit = () => {
    const { street, city, state, pincode } = address;
    if (!street || !city || !state || !pincode) return alert("Please fill all fields.");
    handleSave(address);
    setStep(1);
  };

  return (
    <Modal show={show} onHide={() => { setStep(1); handleClose(); }} centered backdrop="static">
      <style>{`
        .modal-content { border-radius: 20px; border: none; }
        .premium-label { font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; margin-bottom: 5px; }
        .compact-input { border-radius: 10px !important; padding: 10px 15px !important; border: 1.5px solid #f4f4f5 !important; }
        .compact-input:focus { border-color: #fe3d00 !important; box-shadow: 0 0 0 4px rgba(254, 61, 0, 0.1) !important; outline: none !important; }
      `}</style>
      <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
        <Modal.Title style={{ fontWeight: "900", fontSize: "1.3rem" }}>
          {step === 1 ? "👤 Step 1: Contact" : "📍 Step 2: Shipping"}
        </Modal.Title>
      </Modal.Header>
      <div className="px-4 mt-2">
        <ProgressBar now={step === 1 ? 50 : 100} variant="warning" style={{ height: "5px", borderRadius: "10px" }} />
      </div>
      <Modal.Body className="px-4 py-3">
        <Form>
          {step === 1 ? (
            <div className="step-container">
              <Form.Group className="mb-3">
                <div className="premium-label">Full Name</div>
                <Form.Control placeholder="e.g. Rahul Sharma" name="fullName" value={address.fullName} onChange={handleChange} className="compact-input" />
              </Form.Group>
              <Form.Group className="mb-0">
                <div className="premium-label">Mobile Number</div>
                <Form.Control type="number" placeholder="987xxxxxxx" name="phone" value={address.phone} onChange={handleChange} className="compact-input" />
              </Form.Group>
            </div>
          ) : (
            <div className="step-container">
              <Form.Group className="mb-3">
                <div className="premium-label">Street Address</div>
                <Form.Control placeholder="Building, Street, Area" name="street" value={address.street} onChange={handleChange} className="compact-input" />
              </Form.Group>
              <Row className="mb-3">
                <Col xs={7}><div className="premium-label">City</div><Form.Control name="city" value={address.city} onChange={handleChange} className="compact-input" /></Col>
                <Col xs={5}><div className="premium-label">Pincode</div><Form.Control type="number" name="pincode" value={address.pincode} onChange={handleChange} className="compact-input" /></Col>
              </Row>
              <Form.Group>
                <div className="premium-label">State</div>
                <Form.Select name="state" value={address.state} onChange={handleChange} className="compact-input">
                  <option value="">Select State</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4 pt-0">
        <div className="d-flex w-100 gap-3">
          {step === 2 && <Button variant="light" onClick={() => setStep(1)} className="flex-grow-1 fw-bold" style={{ borderRadius: "12px" }}>Back</Button>}
          <Button onClick={step === 1 ? nextStep : handleSubmit} disabled={isValidating} className="flex-grow-1 fw-bold border-0" style={{ backgroundColor: "#fe3d00", padding: "12px", borderRadius: "12px" }}>
            {isValidating ? <Spinner size="sm" animation="border" /> : (step === 1 ? "Next Step →" : "Proceed to Payment")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
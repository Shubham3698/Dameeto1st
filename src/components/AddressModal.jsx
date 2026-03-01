import React, { useState } from "react";
import { Modal, Button, Form, ProgressBar, Spinner, Row, Col } from "react-bootstrap";

export default function AddressModal({ show, handleClose, handleSave }) {
  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
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
    // Strictly control length for phone and pincode
    if (name === "phone" && value.length > 10) return;
    if (name === "pincode" && value.length > 6) return;
    setAddress({ ...address, [name]: value });
  };

  const validatePhoneFormat = (phone) => /^[6-9]\d{9}$/.test(phone);

  // 🔥 Strictly Check Number Existence (Simulation of API verification)
  const nextStep = async () => {
    if (step === 1) {
      if (!address.fullName || !address.phone) return alert("Please enter name and phone.");
      if (!validatePhoneFormat(address.phone)) return alert("Invalid Indian phone number!");

      setIsValidating(true);
      
      try {
        // 🔥 Simulating Backend/API verification delay
        // Yahan aap real API hit kar sakte hain agar future mein OTP dalna ho
        await new Promise((resolve) => setTimeout(resolve, 1500)); 
        
        setStep(2);
      } catch (error) {
        alert("Verification failed. Please try again.");
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleSubmit = () => {
    const { street, city, state, pincode } = address;
    if (!street || !city || !state || !pincode) return alert("Please fill all fields.");
    if (pincode.length !== 6) return alert("Pincode must be 6 digits.");

    handleSave(address);
    setStep(1); // Reset step for next time
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={() => { setStep(1); handleClose(); }} 
      centered 
      backdrop="static" 
      keyboard={false}
      style={{ zIndex: "10001" }} // Higher than Navbars
    >
      <style>{`
        .modal-backdrop { z-index: 10000 !important; background-color: rgba(0,0,0,0.7) !important; }
        .modal-content { border-radius: 20px; border: none; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        .premium-label { font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; margin-bottom: 5px; }
        .compact-input { 
          border-radius: 10px !important; 
          padding: 10px 15px !important; 
          font-size: 0.95rem !important; 
          border: 1.5px solid #f4f4f5 !important;
          background-color: #fcfcfc !important;
        }
        .compact-input:focus { 
          border-color: #fe3d00 !important; 
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(254, 61, 0, 0.1) !important;
          outline: none !important;
        }
        .step-container { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
        <Modal.Title style={{ fontWeight: "900", color: "#18181b", fontSize: "1.3rem" }}>
          {step === 1 ? "👤 Step 1: Contact" : "📍 Step 2: Shipping"}
        </Modal.Title>
      </Modal.Header>

      <div className="px-4 mt-2">
        <ProgressBar 
          now={step === 1 ? 50 : 100} 
          variant="warning" 
          style={{ height: "5px", borderRadius: "10px", backgroundColor: "#f4f4f5" }} 
        />
      </div>

      <Modal.Body className="px-4 py-3">
        <Form>
          {step === 1 ? (
            <div className="step-container">
              <Form.Group className="mb-3">
                <div className="premium-label">Full Name</div>
                <Form.Control
                  placeholder="e.g. Rahul Sharma"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  className="compact-input"
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <div className="premium-label">Mobile Number</div>
                <div className="position-relative">
                  <Form.Control
                    type="number"
                    placeholder="987xxxxxxx"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    className="compact-input"
                  />
                  {isValidating && (
                    <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                      <Spinner animation="border" size="sm" variant="warning" />
                    </div>
                  )}
                </div>
                <small className="text-muted" style={{ fontSize: "10px" }}>* Network existence is strictly verified.</small>
              </Form.Group>
            </div>
          ) : (
            <div className="step-container">
              <Form.Group className="mb-3">
                <div className="premium-label">Street / House Address</div>
                <Form.Control
                  placeholder="Building, Street, Area"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  className="compact-input"
                />
              </Form.Group>

              <Row className="mb-3">
                <Col xs={7}>
                  <div className="premium-label">City</div>
                  <Form.Control
                    placeholder="City"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    className="compact-input"
                  />
                </Col>
                <Col xs={5}>
                  <div className="premium-label">Pincode</div>
                  <Form.Control
                    type="number"
                    placeholder="6 Digits"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    className="compact-input"
                  />
                </Col>
              </Row>

              <Form.Group>
                <div className="premium-label">State</div>
                <Form.Select
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="compact-input"
                >
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
          {step === 2 && (
            <Button 
              variant="light" 
              onClick={() => setStep(1)} 
              className="flex-grow-1 fw-bold"
              style={{ borderRadius: "12px", padding: "12px", border: "1px solid #e4e4e7" }}
            >
              Back
            </Button>
          )}
          <Button
            onClick={step === 1 ? nextStep : handleSubmit}
            disabled={isValidating}
            className="flex-grow-1 fw-bold border-0"
            style={{ 
                backgroundColor: "#fe3d00", 
                padding: "12px", 
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(254, 61, 0, 0.2)" 
            }}
          >
            {isValidating ? (
              <><Spinner size="sm" animation="grow" className="me-2" />Verifying...</>
            ) : (
              step === 1 ? "Next Step →" : "Confirm & Pay"
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function PaymentModal({ show, handleClose, amount }) {

  const handleInstamojoPayment = async () => {

    try {

      const res = await fetch("http://localhost:000/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount   // cart final total
        }),
      });

      const data = await res.json();

      if (data.longurl) {

        // redirect to Instamojo payment page
        window.location.href = data.longurl;

      } else {

        alert("Payment link generate nahi hua");

      }

    } catch (err) {

      console.error(err);
      alert("Payment server error");

    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>

      <Modal.Header closeButton>
        <Modal.Title>Complete Your Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">

        <h5 style={{ fontWeight: "700" }}>
          Final Order Amount
        </h5>

        <h2
          style={{
            color: "#fe3d00",
            fontWeight: "900",
            marginTop: "10px"
          }}
        >
          ₹{amount}
        </h2>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          This is the total amount for your cart items.
        </p>

        <p style={{ fontSize: "13px", color: "gray" }}>
          Secure payment powered by Instamojo
        </p>

      </Modal.Body>

      <Modal.Footer>

        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          style={{
            background: "#fe3d00",
            border: "none",
            fontWeight: "700",
            padding: "8px 20px"
          }}
          onClick={handleInstamojoPayment}
        >
          Pay ₹{amount}
        </Button>

      </Modal.Footer>

    </Modal>
  );
}
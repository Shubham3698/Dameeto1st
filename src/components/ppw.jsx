// ProductDetailView.jsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ProductDetailView({ images }) {
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = (img, desc) => {
    setSelectedImage({ src: img, description: desc });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <>
      <div className="container mt-4">
        <div className="row g-3">
          {images.map((imgObj, idx) => (
            <div key={idx} className="col-6 col-md-3 d-flex flex-column gap-3">
              <img
                className="img-fluid rounded"
                src={imgObj.src}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(imgObj.src, imgObj.description)}
              />
            </div>
          ))}
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Body style={{ padding: "0" }}>
          {selectedImage && (
            <>
              <img
                src={selectedImage.src}
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
              <div style={{ padding: "16px" }}>
                <p>{selectedImage.description}</p>
                <Button variant="danger" style={{ width: "100%" }}>
                  Add to Cart
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

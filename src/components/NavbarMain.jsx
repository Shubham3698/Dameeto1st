import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function NavbarMain() {

  const navStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "background 0.3s ease",
  };

  const linkStyle = {
    color: "Black",
    fontWeight: 500
  };

  const brandStyle = {
    color: "RED",
    fontWeight: 700
  };

  // 💥 Important part: removes border, outline, radius
  const toggleStyle = {
    border: "none",
    outline: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    borderRadius: "0px", // ensures no rounded edges
    padding: "6px",
  };

  return (
    <Navbar collapseOnSelect expand="lg" style={navStyle} fixed="top">
      <Container>
        <Navbar.Brand href="/" style={brandStyle}>
          Dameeto
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={toggleStyle}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" style={linkStyle}>Home</Nav.Link>
            <Nav.Link href="#shop" style={linkStyle}>Shop</Nav.Link>
            <Nav.Link href="#about" style={linkStyle}>About</Nav.Link>
            <Nav.Link href="#login" style={linkStyle}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

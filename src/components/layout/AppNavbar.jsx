import { Navbar, Nav, Container, Form, Button, NavDropdown, Image } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(term.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" sticky="top" className="app-navbar py-2">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ✨ Glowy Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              Products
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Form className="d-flex me-lg-3 my-2 my-lg-0" onSubmit={onSearch} role="search">
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search products"
            />
            <Button type="submit" className="btn-brand ms-2">
              Search
            </Button>
          </Form>

          <Nav className="align-items-lg-center">
            <Nav.Link as={NavLink} to="/cart" className="position-relative me-2">
              🛒 Cart
              {totalItems > 0 && (
                <span className="badge rounded-pill bg-danger nav-cart-badge">{totalItems}</span>
              )}
            </Nav.Link>

            {isAuthenticated ? (
              <NavDropdown
                align="end"
                title={
                  <span className="d-inline-flex align-items-center gap-2">
                    <Image src={user?.image} roundedCircle width={28} height={28} alt="" />
                    {user?.firstName || user?.username}
                  </span>
                }
                id="user-menu"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-brand" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" className="btn-brand">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

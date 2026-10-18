import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-5 pt-4 pb-3" style={{ background: "#fff", borderTop: "1px solid #f6d5e3" }}>
      <Container>
        <Row className="gy-3">
          <Col md={5}>
            <h5 className="text-brand fw-bold">✨ Glowy Store</h5>
            <p className="text-muted small mb-0">
              Your destination for makeup, skin care and fragrances — built with React, React
              Bootstrap, and the DummyJSON API.
            </p>
          </Col>
          <Col md={3}>
            <h6 className="fw-semibold">Shop</h6>
            <ul className="list-unstyled small">
              <li>
                <Link to="/products" className="text-muted">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted">
                  Cart
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="fw-semibold">Account</h6>
            <ul className="list-unstyled small">
              <li>
                <Link to="/login" className="text-muted">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted">
                  Dashboard
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <div className="text-center text-muted small">
          © {new Date().getFullYear()} Glowy Store. Built for educational purposes.
        </div>
      </Container>
    </footer>
  );
}

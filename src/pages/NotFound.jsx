import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container className="py-5 text-center page-min d-flex flex-column justify-content-center">
      <div style={{ fontSize: "5rem" }}>🧭</div>
      <h1 className="fw-bold">404</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <div>
        <Button as={Link} to="/" className="btn-brand">
          Back Home
        </Button>
      </div>
    </Container>
  );
}

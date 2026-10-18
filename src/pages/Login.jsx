import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DEMO_ACCOUNT } from "../api/auth";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ ...DEMO_ACCOUNT });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 4) e.password = "Password must be at least 4 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.firstName || user.username}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <Card className="p-4">
            <Card.Body>
              <h3 className="fw-bold mb-1">Welcome back 👋</h3>
              <p className="text-muted">Log in to your Glowy Store account.</p>

              {serverError && <Alert variant="danger">{serverError}</Alert>}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username or Email</Form.Label>
                  <Form.Control
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="julia"
                  />
                  <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="••••••••"
                    />
                    <Button variant="outline-secondary" onClick={() => setShowPw((s) => !s)}>
                      {showPw ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" className="btn-brand w-100" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Form>

              <p className="text-center text-muted small mt-3 mb-0">
                No account?{" "}
                <Link to="/register" className="text-brand fw-semibold">
                  Create one
                </Link>
              </p>
              <Alert variant="light" className="mt-3 mb-0 small border">
                <strong>Demo credentials:</strong> username <code>{DEMO_ACCOUNT.username}</code> / password{" "}
                <code>{DEMO_ACCOUNT.password}</code>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

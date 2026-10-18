import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Badge, Button, Table } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getAuthUser } from "../api/auth";
import { getCartsByUser } from "../api/carts";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fresh, setFresh] = useState(user);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        // Confirm the session via the "Get Auth User" route.
        const me = await getAuthUser();
        if (!active) return;
        setFresh(me);
        const cartData = await getCartsByUser(me.id);
        if (active) setCarts(cartData.carts || []);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <Loader label="Loading profile..." />;
  const u = fresh || user;

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col lg={4}>
          <Card className="p-4 text-center">
            <Image
              src={u.image}
              roundedCircle
              width={110}
              height={110}
              className="mx-auto mb-3 border"
              alt={u.username}
            />
            <h4 className="mb-0">
              {u.firstName} {u.lastName}
            </h4>
            <div className="text-muted">@{u.username}</div>
            <Badge bg="info" className="mx-auto mt-2 text-capitalize">
              {u.role || "user"}
            </Badge>
            <Button variant="outline-danger" className="mt-3" onClick={handleLogout}>
              Logout
            </Button>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="p-4 mb-4">
            <h5 className="fw-bold mb-3">Account Details</h5>
            <Table borderless className="mb-0">
              <tbody>
                <tr>
                  <td className="text-muted" style={{ width: 160 }}>
                    Email
                  </td>
                  <td>{u.email}</td>
                </tr>
                <tr>
                  <td className="text-muted">Phone</td>
                  <td>{u.phone || "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">Gender</td>
                  <td className="text-capitalize">{u.gender || "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">Age</td>
                  <td>{u.age || "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">University</td>
                  <td>{u.university || "—"}</td>
                </tr>
              </tbody>
            </Table>
          </Card>

          <Card className="p-4">
            <h5 className="fw-bold mb-3">My Carts</h5>
            {carts.length === 0 ? (
              <p className="text-muted mb-0">No carts found for this account.</p>
            ) : (
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Cart #</th>
                    <th>Items</th>
                    <th>Products</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.totalQuantity}</td>
                      <td>{c.totalProducts}</td>
                      <td className="fw-semibold">${c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/products";
import { getCarts } from "../../api/carts";
import { getUsers } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";

const stats = [
  { key: "products", label: "Products", icon: "📦", bg: "linear-gradient(135deg,#d63d7e,#a8285f)" },
  { key: "carts", label: "Carts", icon: "🛒", bg: "linear-gradient(135deg,#f78fb3,#e0607e)" },
  { key: "users", label: "Users", icon: "👥", bg: "linear-gradient(135deg,#b388eb,#8a5cc7)" },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ products: 0, carts: 0, users: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentCarts, setRecentCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, c, u] = await Promise.all([
          getProducts({ limit: 5 }),
          getCarts({ limit: 5 }),
          getUsers({ limit: 1 }),
        ]);
        setCounts({ products: p.total, carts: c.total, users: u.total });
        setRecentProducts(p.products);
        setRecentCarts(c.carts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <>
      <div className="mb-4">
        <h3 className="fw-bold mb-0">Welcome, {user?.firstName || user?.username} 👋</h3>
        <p className="text-muted">Here's an overview of your store.</p>
      </div>

      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col md={4} key={s.key}>
            <div className="stat-card" style={{ background: s.bg }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="opacity-75">{s.label}</div>
                  <div className="fs-2 fw-bold">{counts[s.key]}</div>
                </div>
                <div style={{ fontSize: "2.4rem" }}>{s.icon}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Recent Products</h6>
              <Link to="/dashboard/products" className="text-brand small">
                Manage →
              </Link>
            </div>
            <Table hover responsive className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td className="line-clamp-2">{p.title}</td>
                    <td className="text-capitalize">{p.category}</td>
                    <td>${p.price}</td>
                    <td>
                      <Badge bg={p.stock > 0 ? "success" : "secondary"}>{p.stock}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Recent Carts</h6>
              <Link to="/dashboard/carts" className="text-brand small">
                Manage →
              </Link>
            </div>
            <Table hover responsive className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Cart</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentCarts.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.userId}</td>
                    <td>{c.totalQuantity}</td>
                    <td className="fw-semibold">${c.total}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </>
  );
}

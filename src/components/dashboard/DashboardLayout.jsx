import { Container, Row, Col, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import AppNavbar from "../layout/AppNavbar";

const links = [
  { to: "/dashboard", label: "Overview", icon: "📊", end: true },
  { to: "/dashboard/products", label: "Products", icon: "📦" },
  { to: "/dashboard/carts", label: "Carts", icon: "🛒" },
  { to: "/dashboard/users", label: "Users", icon: "👥" },
  { to: "/profile", label: "Authentication", icon: "🔐" },
];

export default function DashboardLayout() {
  return (
    <>
      <AppNavbar />
      <Container fluid className="dash-shell px-0">
        <Row className="g-0">
          <Col xs={12} lg={2} className="dash-sidebar p-3">
            <div className="text-uppercase small text-secondary mb-2 px-2">Dashboard</div>
            <Nav className="flex-lg-column">
              {links.map((l) => (
                <Nav.Link
                  key={l.to}
                  as={NavLink}
                  to={l.to}
                  end={l.end}
                  className="d-flex align-items-center gap-2"
                >
                  <span>{l.icon}</span>
                  <span>{l.label}</span>
                </Nav.Link>
              ))}
            </Nav>
          </Col>
          <Col xs={12} lg={10} className="p-3 p-md-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
}

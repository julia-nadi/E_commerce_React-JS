import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../api/products";
import ProductCard from "../components/ProductCard";
import Loader from "../components/common/Loader";

// DummyJSON categories can be strings (legacy) or objects ({ slug, name }).
const catName = (c) => (typeof c === "string" ? c : c.name || c.slug);
const catSlug = (c) => (typeof c === "string" ? c : c.slug);
const categoryIcons = { beauty: "💄", fragrances: "🌸", "skin-care": "🧴" };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prod, cats] = await Promise.all([
          getProducts({ limit: 8, sortBy: "rating", order: "desc" }),
          getCategories(),
        ]);
        setFeatured(prod.products);
        setCategories(cats.slice(0, 8));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      {/* Hero banner (full screen width) */}
      <section className="hero-banner">
        <Container>
          <Row className="align-items-center g-4 g-lg-5">
            <Col md={{ span: 6, order: 2 }} className="d-flex justify-content-md-end">
              <img
                src="/hero-banner.png"
                alt="Glowy — up to 36% off + free pouch. Dewy Glow Essentials"
                className="hero-banner-img"
              />
            </Col>
            <Col md={{ span: 6, order: 1 }}>
              <h1 className="fw-bold display-5">Glow up with beauty you love.</h1>
              <p className="lead text-muted">
                Discover makeup, skin care and fragrances picked for you. Shine bright with
                Glowy Store.
              </p>
              <Link to="/products" className="btn btn-brand btn-lg hero-banner-cta">
                Shop Now
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Shop by Category</h3>
          <Link to="/products" className="text-brand fw-semibold">
            View all →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <Row className="g-3">
            {categories.map((c) => (
              <Col xs={6} md={3} key={catSlug(c)}>
                <Card
                  as={Link}
                  to={`/products?category=${encodeURIComponent(catSlug(c))}`}
                  className="text-center p-3 h-100 text-decoration-none text-ink cursor-pointer"
                >
                  <div style={{ fontSize: "1.8rem" }}>{categoryIcons[catSlug(c)] || "✨"}</div>
                  <div className="fw-semibold text-capitalize mt-1">{catName(c)}</div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Featured products */}
      <Container className="pb-5">
        <h3 className="fw-bold mb-3">Featured Products</h3>
        {loading ? (
          <Loader />
        ) : (
          <Row className="g-4">
            {featured.map((p) => (
              <Col xs={12} sm={6} lg={3} key={p.id}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}

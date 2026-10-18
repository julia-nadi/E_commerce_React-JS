import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge, Image, Card, Breadcrumb, Table } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import Rating from "../components/common/Rating";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        const p = await getProduct(id);
        if (!alive) return;
        setProduct(p);
        setActive(0);
        setQty(1);
        setNotFound(false);
      } catch {
        if (alive) setNotFound(true);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [id]);

  // While a new id is being fetched, the old product is still in state — show a loader.
  const isCurrent = product && String(product.id) === String(id);
  if (!notFound && !isCurrent) return <Loader label="Loading product..." />;
  if (notFound || !product)
    return (
      <Container className="py-5">
        <EmptyState icon="🚫" title="Product not found" message="It may have been removed.">
          <Button className="btn-brand mt-2" onClick={() => navigate("/products")}>
            Back to products
          </Button>
        </EmptyState>
      </Container>
    );

  const images = product.images?.length ? product.images : [product.thumbnail];
  const finalPrice = (product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2);

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${qty} × ${product.title} added to cart`);
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
          Products
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/products?category=${product.category}` }}
          className="text-capitalize"
        >
          {product.category}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3">
            <Image
              src={images[active]}
              alt={product.title}
              fluid
              style={{ height: 360, objectFit: "contain" }}
            />
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  onClick={() => setActive(i)}
                  className={`border rounded cursor-pointer ${i === active ? "border-2" : ""}`}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "contain",
                    borderColor: i === active ? "var(--brand)" : undefined,
                  }}
                  alt=""
                />
              ))}
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <div className="text-muted text-capitalize small">{product.brand || product.category}</div>
          <h2 className="fw-bold">{product.title}</h2>
          <Rating value={product.rating} count={product.reviews?.length} />

          <div className="my-3 d-flex align-items-baseline gap-3">
            <span className="display-6 fw-bold text-brand">${finalPrice}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-muted text-decoration-line-through fs-5">
                  ${product.price}
                </span>
                <Badge bg="danger">-{Math.round(product.discountPercentage)}%</Badge>
              </>
            )}
          </div>

          <p className="text-muted">{product.description}</p>

          <div className="mb-3">
            <Badge bg={product.stock > 0 ? "success" : "secondary"} className="me-2">
              {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
            </Badge>
            <Badge bg="light" text="dark" className="border">
              {product.availabilityStatus || "Available"}
            </Badge>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center border rounded">
              <Button variant="light" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </Button>
              <span className="px-3 fw-semibold">{qty}</span>
              <Button variant="light" onClick={() => setQty((q) => q + 1)}>
                +
              </Button>
            </div>
            <Button className="btn-brand flex-grow-1" onClick={handleAdd} disabled={product.stock === 0}>
              Add to Cart
            </Button>
          </div>

          <Table borderless size="sm" className="text-muted">
            <tbody>
              <tr>
                <td style={{ width: 140 }}>SKU</td>
                <td>{product.sku || "—"}</td>
              </tr>
              <tr>
                <td>Warranty</td>
                <td>{product.warrantyInformation || "—"}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>{product.shippingInformation || "—"}</td>
              </tr>
              <tr>
                <td>Return Policy</td>
                <td>{product.returnPolicy || "—"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {product.reviews?.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-3">Reviews</h4>
          <Row className="g-3">
            {product.reviews.map((r, i) => (
              <Col md={6} key={i}>
                <Card className="p-3 h-100">
                  <div className="d-flex justify-content-between">
                    <strong>{r.reviewerName}</strong>
                    <Rating value={r.rating} />
                  </div>
                  <p className="text-muted mb-1 mt-2">{r.comment}</p>
                  <small className="text-muted">{new Date(r.date).toLocaleDateString()}</small>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
}

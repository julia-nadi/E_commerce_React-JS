import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./common/Rating";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, 1);
    toast.success(`${product.title} added to cart`);
  };

  const finalPrice = (product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2);

  return (
    <Card className="product-card">
      <Link to={`/products/${product.id}`} className="position-relative">
        <Card.Img
          variant="top"
          src={product.thumbnail}
          alt={product.title}
          className="product-thumb"
        />
        {product.discountPercentage > 0 && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}
      </Link>
      <Card.Body className="d-flex flex-column">
        <div className="text-muted small text-capitalize">{product.category}</div>
        <Card.Title as="h6" className="line-clamp-2 mb-1" style={{ minHeight: "2.4em" }}>
          <Link to={`/products/${product.id}`} className="text-ink text-decoration-none">
            {product.title}
          </Link>
        </Card.Title>
        <Rating value={product.rating} />
        <div className="mt-2 d-flex align-items-baseline gap-2">
          <span className="fw-bold fs-5 text-brand">${finalPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="text-muted text-decoration-line-through small">
              ${product.price}
            </span>
          )}
        </div>
        <Button className="btn-brand mt-3 mt-auto w-100" onClick={handleAdd}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}

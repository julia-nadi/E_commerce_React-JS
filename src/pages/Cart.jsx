import { Container, Row, Col, Card, Button, Image, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addCart } from "../api/carts";
import EmptyState from "../components/common/EmptyState";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const { items, subtotal, discount, total, totalItems, setQty, removeFromCart, clearCart } =
    useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout");
      navigate("/login");
      return;
    }
    setPlacing(true);
    try {
      // Persist the cart to DummyJSON via "Add a cart".
      const created = await addCart({
        userId: user.id,
        products: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      });
      toast.success(`Order placed! Cart #${created.id} created with ${created.totalProducts} items.`);
      clearCart();
      navigate("/dashboard/carts");
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <EmptyState icon="🛒" title="Your cart is empty" message="Add some products to get started.">
          <Button as={Link} to="/products" className="btn-brand mt-2">
            Browse Products
          </Button>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4">Shopping Cart ({totalItems})</h2>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="p-0 overflow-hidden">
            <Table responsive className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-3">
                        <Image src={i.thumbnail} width={54} height={54} style={{ objectFit: "contain" }} />
                        <div>
                          <Link to={`/products/${i.id}`} className="fw-semibold text-ink line-clamp-2">
                            {i.title}
                          </Link>
                          <div className="text-muted small text-capitalize">{i.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>${i.price}</td>
                    <td>
                      <div className="d-flex align-items-center border rounded" style={{ width: "fit-content" }}>
                        <Button variant="light" size="sm" onClick={() => setQty(i.id, i.quantity - 1)}>
                          −
                        </Button>
                        <span className="px-2">{i.quantity}</span>
                        <Button variant="light" size="sm" onClick={() => setQty(i.id, i.quantity + 1)}>
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="fw-semibold">${(i.price * i.quantity).toFixed(2)}</td>
                    <td>
                      <Button variant="link" className="text-danger" onClick={() => removeFromCart(i.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <Button variant="outline-secondary" className="mt-3" onClick={clearCart}>
            Clear Cart
          </Button>
        </Col>

        <Col lg={4}>
          <Card className="p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Discount</span>
              <span className="text-success">−${discount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span className="text-brand">${total.toFixed(2)}</span>
            </div>
            <Button className="btn-brand w-100" onClick={handleCheckout} disabled={placing}>
              {placing ? "Placing order..." : "Checkout"}
            </Button>
            <Button as={Link} to="/products" variant="link" className="w-100 text-muted mt-2">
              Continue Shopping
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

import { Modal, Table, Image, Row, Col, Button, Badge } from "react-bootstrap";

// Read-only detailed view of a single cart's contents and totals.
export default function CartDetailModal({ cart, onHide }) {
  if (!cart) return null;
  return (
    <Modal show={!!cart} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cart #{cart.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3 g-2">
          <Col xs={6} md={3}>
            <div className="text-muted small">User ID</div>
            <div className="fw-semibold">{cart.userId}</div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-muted small">Products</div>
            <div className="fw-semibold">{cart.totalProducts}</div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-muted small">Items</div>
            <div className="fw-semibold">{cart.totalQuantity}</div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-muted small">Total</div>
            <div className="fw-semibold text-brand">${cart.total}</div>
          </Col>
        </Row>

        <Table hover responsive className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.products?.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {p.thumbnail && (
                      <Image src={p.thumbnail} width={40} height={40} style={{ objectFit: "contain" }} />
                    )}
                    <span className="line-clamp-2">{p.title}</span>
                  </div>
                </td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <Badge bg="light" text="dark">
                    -{Math.round(p.discountPercentage || 0)}%
                  </Badge>
                </td>
                <td className="fw-semibold">${p.discountedTotal ?? p.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-end gap-4 pe-2">
          <div className="text-muted">
            Subtotal: <span className="text-decoration-line-through">${cart.total}</span>
          </div>
          <div className="fw-bold">Discounted: ${cart.discountedTotal ?? cart.total}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

import { useState } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";

// Create a new cart: pick a user id and add product rows (id + quantity).
// Mounted only while open, so state starts fresh each time.
export default function CartFormModal({ show, onHide, onSubmit, saving }) {
  const [userId, setUserId] = useState(1);
  const [rows, setRows] = useState([{ id: "", quantity: 1 }]);
  const [error, setError] = useState("");

  const updateRow = (i, field, value) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const addRow = () => setRows((r) => [...r, { id: "", quantity: 1 }]);
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    const products = rows
      .filter((r) => r.id !== "" && Number(r.id) > 0)
      .map((r) => ({ id: Number(r.id), quantity: Math.max(1, Number(r.quantity) || 1) }));
    if (products.length === 0) {
      setError("Add at least one product with a valid product ID.");
      return;
    }
    onSubmit({ userId: Number(userId), products });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>Add Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Form.Group>

          <Form.Label>Products</Form.Label>
          <Table size="sm" className="align-middle">
            <thead>
              <tr>
                <th>Product ID</th>
                <th style={{ width: 110 }}>Qty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      placeholder="e.g. 1"
                      value={row.id}
                      onChange={(e) => updateRow(i, "id", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) => updateRow(i, "quantity", e.target.value)}
                    />
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => removeRow(i)}
                      disabled={rows.length === 1}
                    >
                      ✕
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-secondary" size="sm" onClick={addRow}>
            + Add product row
          </Button>
          {error && <div className="text-danger small mt-2">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="btn-brand" disabled={saving}>
            {saving ? "Creating..." : "Create Cart"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const blank = {
  title: "",
  description: "",
  price: "",
  discountPercentage: "",
  stock: "",
  brand: "",
  category: "",
  thumbnail: "",
};

// Modal form used for both "Add" and "Edit" product flows.
// Mounted only while open, so initial state is seeded directly from props.
export default function ProductFormModal({ show, onHide, onSubmit, initial, categories = [], saving }) {
  const [form, setForm] = useState(() => (initial ? { ...blank, ...initial } : blank));
  const [errors, setErrors] = useState({});
  const isEdit = !!initial;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.price === "" || Number(form.price) < 0) e.price = "Enter a valid price";
    if (form.stock !== "" && Number(form.stock) < 0) e.stock = "Stock cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      discountPercentage: Number(form.discountPercentage) || 0,
      stock: Number(form.stock) || 0,
      brand: form.brand,
      category: form.category,
      thumbnail: form.thumbnail,
    });
  };

  const catSlug = (c) => (typeof c === "string" ? c : c.slug);
  const catName = (c) => (typeof c === "string" ? c : c.name || c.slug);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Label>Title *</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={catSlug(c)} value={catSlug(c)}>
                    {catName(c)}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={12}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Price ($) *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                isInvalid={!!errors.stock}
              />
              <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Brand</Form.Label>
              <Form.Control name="brand" value={form.brand} onChange={handleChange} />
            </Col>
            <Col md={6}>
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control name="thumbnail" value={form.thumbnail} onChange={handleChange} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="btn-brand" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

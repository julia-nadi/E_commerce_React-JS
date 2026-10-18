import { useCallback, useEffect, useState } from "react";
import { Card, Table, Button, Form, InputGroup, Image, Badge } from "react-bootstrap";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import PaginationBar from "../../components/common/PaginationBar";
import ConfirmModal from "../../components/common/ConfirmModal";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import toast from "react-hot-toast";

const LIMIT = 10;

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    try {
      let data;
      if (q) data = await searchProducts({ q, limit: LIMIT, skip });
      else if (category) data = await getProductsByCategory({ category, limit: LIMIT, skip });
      else data = await getProducts({ limit: LIMIT, skip });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [q, category, skip]);

  useEffect(() => {
    load();
  }, [load]);

  const doSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSkip(0);
    setCategory("");
    setQ(term.trim());
  };

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProduct(editing.id, payload);
        toast.success(`"${updated.title}" updated`);
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...updated } : p)));
      } else {
        const created = await addProduct(payload);
        toast.success(`"${created.title}" created (id ${created.id})`);
        // DummyJSON doesn't persist new products, so show it locally at the top.
        setProducts((prev) => [created, ...prev]);
        setTotal((t) => t + 1);
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeletingBusy(true);
    try {
      await deleteProduct(deleting.id);
      toast.success(`"${deleting.title}" deleted`);
      setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
      setTotal((t) => Math.max(0, t - 1));
      setDeleting(null);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h3 className="fw-bold mb-0">Manage Products</h3>
        <Button className="btn-brand" onClick={openAdd}>
          + Add Product
        </Button>
      </div>

      <Card className="p-3 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <Form onSubmit={doSearch} className="flex-grow-1" style={{ minWidth: 220 }}>
            <InputGroup>
              <Form.Control
                placeholder="Search products..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button type="submit" className="btn-brand">
                Search
              </Button>
            </InputGroup>
          </Form>
          <Form.Select
            style={{ maxWidth: 220 }}
            value={category}
            onChange={(e) => {
              setLoading(true);
              setSkip(0);
              setQ("");
              setTerm("");
              setCategory(e.target.value);
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => {
              const slug = typeof c === "string" ? c : c.slug;
              const name = typeof c === "string" ? c : c.name || c.slug;
              return (
                <option key={slug} value={slug}>
                  {name}
                </option>
              );
            })}
          </Form.Select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <EmptyState icon="📦" title="No products" message="Try a different search or add one." />
        ) : (
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center gap-2">
                      <Image
                        src={p.thumbnail}
                        width={44}
                        height={44}
                        style={{ objectFit: "contain" }}
                      />
                      <div>
                        <div className="fw-semibold line-clamp-2">{p.title}</div>
                        <small className="text-muted">#{p.id}</small>
                      </div>
                    </div>
                  </td>
                  <td className="text-capitalize">{p.category}</td>
                  <td>${p.price}</td>
                  <td>
                    <Badge bg={p.stock > 0 ? "success" : "secondary"}>{p.stock}</Badge>
                  </td>
                  <td>{p.rating ?? "—"}</td>
                  <td className="text-end pe-3">
                    <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openEdit(p)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleting(p)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {!loading && total > LIMIT && (
        <PaginationBar
          total={total}
          limit={LIMIT}
          skip={skip}
          onChange={(s) => {
            setLoading(true);
            setSkip(s);
          }}
        />
      )}

      {showForm && (
        <ProductFormModal
          show={showForm}
          onHide={() => setShowForm(false)}
          onSubmit={handleSubmit}
          initial={editing}
          categories={categories}
          saving={saving}
        />
      )}

      <ConfirmModal
        show={!!deleting}
        title="Delete product?"
        message={deleting ? `Are you sure you want to delete "${deleting.title}"?` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deletingBusy}
      />
    </>
  );
}

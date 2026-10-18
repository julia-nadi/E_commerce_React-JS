import { useCallback, useEffect, useState } from "react";
import { Card, Table, Button, Form, InputGroup, Badge } from "react-bootstrap";
import {
  getCarts,
  getCart,
  getCartsByUser,
  addCart,
  deleteCart,
} from "../../api/carts";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import PaginationBar from "../../components/common/PaginationBar";
import ConfirmModal from "../../components/common/ConfirmModal";
import CartFormModal from "../../components/dashboard/CartFormModal";
import CartDetailModal from "../../components/dashboard/CartDetailModal";
import toast from "react-hot-toast";

const LIMIT = 10;

export default function ManageCarts() {
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [userFilter, setUserFilter] = useState("");
  const [activeUserFilter, setActiveUserFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      if (activeUserFilter) {
        const data = await getCartsByUser(activeUserFilter);
        setCarts(data.carts || []);
        setTotal(data.carts?.length || 0);
      } else {
        const data = await getCarts({ limit: LIMIT, skip });
        setCarts(data.carts || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [skip, activeUserFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const applyUserFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    setSkip(0);
    setActiveUserFilter(userFilter.trim());
  };

  const clearFilter = () => {
    setLoading(true);
    setUserFilter("");
    setActiveUserFilter("");
    setSkip(0);
  };

  const openDetail = async (id) => {
    try {
      const cart = await getCart(id);
      setDetail(cart);
    } catch (err) {
      toast.error(err.message || "Could not load cart");
    }
  };

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      const created = await addCart(payload);
      toast.success(`Cart #${created.id} created for user ${created.userId}`);
      setCarts((prev) => [created, ...prev]);
      setTotal((t) => t + 1);
      setShowForm(false);
    } catch (err) {
      toast.error(err.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeletingBusy(true);
    try {
      await deleteCart(deleting.id);
      toast.success(`Cart #${deleting.id} deleted`);
      setCarts((prev) => prev.filter((c) => c.id !== deleting.id));
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
        <h3 className="fw-bold mb-0">Manage Carts</h3>
        <Button className="btn-brand" onClick={() => setShowForm(true)}>
          + Add Cart
        </Button>
      </div>

      <Card className="p-3 mb-3">
        <Form onSubmit={applyUserFilter} className="d-flex flex-wrap gap-2">
          <InputGroup style={{ maxWidth: 320 }}>
            <InputGroup.Text>User ID</InputGroup.Text>
            <Form.Control
              type="number"
              min={1}
              placeholder="Fetch carts by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
            <Button type="submit" className="btn-brand">
              Filter
            </Button>
          </InputGroup>
          {activeUserFilter && (
            <Button variant="outline-secondary" onClick={clearFilter}>
              Clear filter
            </Button>
          )}
        </Form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <Loader />
        ) : carts.length === 0 ? (
          <EmptyState icon="🛒" title="No carts found" />
        ) : (
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Cart</th>
                <th>User</th>
                <th>Products</th>
                <th>Items</th>
                <th>Total</th>
                <th>Discounted</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((c) => (
                <tr key={c.id}>
                  <td className="ps-3 fw-semibold">#{c.id}</td>
                  <td>
                    <Badge bg="light" text="dark">
                      User {c.userId}
                    </Badge>
                  </td>
                  <td>{c.totalProducts}</td>
                  <td>{c.totalQuantity}</td>
                  <td>${c.total}</td>
                  <td className="text-success">${c.discountedTotal ?? c.total}</td>
                  <td className="text-end pe-3">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => openDetail(c.id)}
                    >
                      View
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleting(c)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {!loading && !activeUserFilter && total > LIMIT && (
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

      <CartDetailModal cart={detail} onHide={() => setDetail(null)} />
      {showForm && (
        <CartFormModal
          show={showForm}
          onHide={() => setShowForm(false)}
          onSubmit={handleCreate}
          saving={saving}
        />
      )}
      <ConfirmModal
        show={!!deleting}
        title="Delete cart?"
        message={deleting ? `Delete cart #${deleting.id}? This cannot be undone.` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deletingBusy}
      />
    </>
  );
}

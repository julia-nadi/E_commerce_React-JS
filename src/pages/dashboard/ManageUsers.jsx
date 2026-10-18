import { useCallback, useEffect, useState } from "react";
import { Card, Table, Button, Form, InputGroup, Image, Badge } from "react-bootstrap";
import { getUsers, searchUsers, filterUsers, deleteUser } from "../../api/users";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import PaginationBar from "../../components/common/PaginationBar";
import ConfirmModal from "../../components/common/ConfirmModal";
import UserDetailModal from "../../components/dashboard/UserDetailModal";
import toast from "react-hot-toast";

const LIMIT = 10;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      let data;
      if (q) {
        data = await searchUsers({ q, limit: LIMIT, skip });
      } else if (genderFilter) {
        data = await filterUsers({ key: "gender", value: genderFilter, limit: LIMIT, skip });
      } else {
        data = await getUsers({ limit: LIMIT, skip });
      }
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [q, genderFilter, skip]);

  useEffect(() => {
    load();
  }, [load]);

  const doSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSkip(0);
    setGenderFilter("");
    setQ(term.trim());
  };

  const handleDelete = async () => {
    setDeletingBusy(true);
    try {
      await deleteUser(deleting.id);
      toast.success(`${deleting.firstName} ${deleting.lastName} deleted`);
      setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
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
      <h3 className="fw-bold mb-3">Manage Users</h3>

      <Card className="p-3 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <Form onSubmit={doSearch} className="flex-grow-1" style={{ minWidth: 220 }}>
            <InputGroup>
              <Form.Control
                placeholder="Search users by name..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button type="submit" className="btn-brand">
                Search
              </Button>
            </InputGroup>
          </Form>
          <Form.Select
            style={{ maxWidth: 200 }}
            value={genderFilter}
            onChange={(e) => {
              setLoading(true);
              setSkip(0);
              setQ("");
              setTerm("");
              setGenderFilter(e.target.value);
            }}
          >
            <option value="">All genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <EmptyState icon="👥" title="No users found" />
        ) : (
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">User</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Company</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center gap-2">
                      <Image src={u.image} width={40} height={40} roundedCircle className="border" />
                      <div>
                        <div className="fw-semibold">
                          {u.firstName} {u.lastName}
                        </div>
                        <small className="text-muted">@{u.username}</small>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <Badge bg={u.gender === "female" ? "danger" : "primary"} className="text-capitalize">
                      {u.gender}
                    </Badge>
                  </td>
                  <td>{u.age}</td>
                  <td>{u.company?.name || "—"}</td>
                  <td className="text-end pe-3">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => setDetail(u)}
                    >
                      View
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setDeleting(u)}>
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

      <UserDetailModal user={detail} onHide={() => setDetail(null)} />
      <ConfirmModal
        show={!!deleting}
        title="Delete user?"
        message={
          deleting ? `Delete ${deleting.firstName} ${deleting.lastName}? This cannot be undone.` : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deletingBusy}
      />
    </>
  );
}

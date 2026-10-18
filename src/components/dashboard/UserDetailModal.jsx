import { Modal, Image, Badge, Table } from "react-bootstrap";

export default function UserDetailModal({ user, onHide }) {
  if (!user) return null;
  return (
    <Modal show={!!user} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <Image src={user.image} roundedCircle width={90} height={90} className="border" />
          <h5 className="mt-2 mb-0">
            {user.firstName} {user.lastName}
          </h5>
          <div className="text-muted">@{user.username}</div>
          <Badge bg="info" className="mt-1 text-capitalize">
            {user.role || "user"}
          </Badge>
        </div>
        <Table borderless size="sm" className="mb-0">
          <tbody>
            <tr>
              <td className="text-muted" style={{ width: 130 }}>
                Email
              </td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="text-muted">Phone</td>
              <td>{user.phone}</td>
            </tr>
            <tr>
              <td className="text-muted">Gender</td>
              <td className="text-capitalize">{user.gender}</td>
            </tr>
            <tr>
              <td className="text-muted">Age</td>
              <td>{user.age}</td>
            </tr>
            <tr>
              <td className="text-muted">Company</td>
              <td>{user.company?.name || "—"}</td>
            </tr>
            <tr>
              <td className="text-muted">City</td>
              <td>{user.address?.city || "—"}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

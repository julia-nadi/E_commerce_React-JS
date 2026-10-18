import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({
  show,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? "Working..." : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

import { Spinner } from "react-bootstrap";

export default function Loader({ label = "Loading...", className = "" }) {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center py-5 ${className}`}>
      <Spinner animation="border" style={{ color: "var(--brand)" }} />
      <span className="text-muted mt-2 small">{label}</span>
    </div>
  );
}

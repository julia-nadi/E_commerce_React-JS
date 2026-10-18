export default function EmptyState({ icon = "📦", title = "Nothing here", message = "", children }) {
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: "3rem" }}>{icon}</div>
      <h5 className="mt-2 mb-1">{title}</h5>
      {message && <p className="text-muted">{message}</p>}
      {children}
    </div>
  );
}

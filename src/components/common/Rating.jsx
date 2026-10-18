export default function Rating({ value = 0, count }) {
  const rounded = Math.round(value);
  return (
    <span className="d-inline-flex align-items-center gap-1 small">
      <span className="rating-star">
        {"★".repeat(rounded)}
        <span className="text-muted">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="text-muted">
        {Number(value).toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </span>
  );
}

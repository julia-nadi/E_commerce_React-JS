import { Pagination } from "react-bootstrap";

/**
 * Simple pagination that maps to DummyJSON's limit & skip model.
 * @param {number} total  total number of items
 * @param {number} limit  page size
 * @param {number} skip   current skip
 * @param {(skip:number)=>void} onChange
 */
export default function PaginationBar({ total, limit, skip, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const current = Math.floor(skip / limit) + 1;
  if (totalPages <= 1) return null;

  const goto = (page) => onChange((page - 1) * limit);

  // Build a compact window of page numbers around the current page.
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <Pagination className="justify-content-center mt-4 flex-wrap">
      <Pagination.First onClick={() => goto(1)} disabled={current === 1} />
      <Pagination.Prev onClick={() => goto(current - 1)} disabled={current === 1} />
      {start > 1 && <Pagination.Ellipsis disabled />}
      {pages.map((p) => (
        <Pagination.Item key={p} active={p === current} onClick={() => goto(p)}>
          {p}
        </Pagination.Item>
      ))}
      {end < totalPages && <Pagination.Ellipsis disabled />}
      <Pagination.Next onClick={() => goto(current + 1)} disabled={current === totalPages} />
      <Pagination.Last onClick={() => goto(totalPages)} disabled={current === totalPages} />
    </Pagination>
  );
}

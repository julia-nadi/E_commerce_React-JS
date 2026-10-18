import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "../api/products";
import ProductCard from "../components/ProductCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import PaginationBar from "../components/common/PaginationBar";

const LIMIT = 12;
const catSlug = (c) => (typeof c === "string" ? c : c.slug);
const catName = (c) => (typeof c === "string" ? c : c.name || c.slug);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const skip = Number(searchParams.get("skip") || 0);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termInput, setTermInput] = useState(q);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    const [sortBy, order] = sort ? sort.split("-") : [undefined, undefined];
    let data;
    try {
      if (q) {
        data = await searchProducts({ q, limit: LIMIT, skip });
      } else if (category) {
        data = await getProductsByCategory({ category, limit: LIMIT, skip, sortBy, order });
      } else {
        data = await getProducts({ limit: LIMIT, skip, sortBy, order });
      }
    } finally {
      setProducts(data?.products || []);
      setTotal(data?.total || 0);
      setLoading(false);
    }
  }, [q, category, sort, skip]);

  useEffect(() => {
    load();
  }, [load]);

  // Merge a set of params, always resetting pagination unless skip is provided.
  const updateParams = (updates) => {
    setLoading(true);
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === "" || v == null) next.delete(k);
      else next.set(k, v);
    });
    if (!("skip" in updates)) next.set("skip", "0");
    setSearchParams(next);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParams({ q: termInput.trim(), category: "" });
  };

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-1">Products</h2>
      <p className="text-muted">
        {q && `Search results for "${q}"`}
        {category && `Category: ${category}`}
        {!q && !category && "Browse our full catalog"}
      </p>

      <Row className="g-4">
        {/* Filters sidebar */}
        <Col lg={3}>
          <Card className="p-3 mb-3">
            <Form onSubmit={submitSearch}>
              <Form.Label className="fw-semibold small">Search</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Search..."
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                />
                <Button type="submit" className="btn-brand">
                  Go
                </Button>
              </InputGroup>
            </Form>
          </Card>

          <Card className="p-3 mb-3">
            <Form.Label className="fw-semibold small">Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => updateParams({ category: e.target.value, q: "" })}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={catSlug(c)} value={catSlug(c)}>
                  {catName(c)}
                </option>
              ))}
            </Form.Select>
          </Card>

          <Card className="p-3">
            <Form.Label className="fw-semibold small">Sort by</Form.Label>
            <Form.Select value={sort} onChange={(e) => updateParams({ sort: e.target.value })}>
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="title-asc">Title: A → Z</option>
              <option value="title-desc">Title: Z → A</option>
            </Form.Select>
            {(q || category || sort) && (
              <Button
                variant="link"
                className="text-muted p-0 mt-3 text-start"
                onClick={() => setSearchParams({})}
              >
                Clear all filters
              </Button>
            )}
          </Card>
        </Col>

        {/* Product grid */}
        <Col lg={9}>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              message="Try adjusting your search or filters."
            />
          ) : (
            <>
              <div className="text-muted small mb-3">
                Showing {skip + 1}–{Math.min(skip + LIMIT, total)} of {total} products
              </div>
              <Row className="g-4">
                {products.map((p) => (
                  <Col xs={12} sm={6} xl={4} key={p.id}>
                    <ProductCard product={p} />
                  </Col>
                ))}
              </Row>
              <PaginationBar
                total={total}
                limit={LIMIT}
                skip={skip}
                onChange={(newSkip) => updateParams({ skip: newSkip })}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

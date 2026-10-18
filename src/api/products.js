import { http } from "./http";

// Glowy Store only sells cosmetics, so the catalog is limited to these DummyJSON categories.
export const COSMETIC_CATEGORIES = ["beauty", "fragrances", "skin-care"];

// The cosmetics catalog is small, so fetch it once and sort/filter/paginate locally.
let catalogPromise;
function getCatalog() {
  if (!catalogPromise) {
    catalogPromise = Promise.all(
      COSMETIC_CATEGORIES.map((c) => http.get(`/products/category/${c}?limit=0`))
    )
      .then((results) => results.flatMap((r) => r.products))
      .catch((err) => {
        catalogPromise = undefined;
        throw err;
      });
  }
  return catalogPromise;
}

function sortProducts(products, sortBy, order = "asc") {
  if (!sortBy) return products;
  const dir = order === "desc" ? -1 : 1;
  return [...products].sort((a, b) => {
    const x = a[sortBy];
    const y = b[sortBy];
    if (typeof x === "string") return x.localeCompare(y) * dir;
    return (x - y) * dir;
  });
}

function paginate(products, limit, skip) {
  return {
    products: products.slice(skip, skip + limit),
    total: products.length,
    skip,
    limit,
  };
}

// List products with pagination + optional sorting.
export async function getProducts({ limit = 12, skip = 0, sortBy, order } = {}) {
  const all = await getCatalog();
  return paginate(sortProducts(all, sortBy, order), limit, skip);
}

export function getProduct(id) {
  return http.get(`/products/${id}`);
}

export async function searchProducts({ q, limit = 12, skip = 0 }) {
  const term = q.toLowerCase();
  const all = await getCatalog();
  const matches = all.filter((p) =>
    [p.title, p.description, p.brand, p.category].some((f) => f?.toLowerCase().includes(term))
  );
  return paginate(matches, limit, skip);
}

export async function getCategories() {
  const cats = await http.get("/products/categories");
  return cats.filter((c) => COSMETIC_CATEGORIES.includes(typeof c === "string" ? c : c.slug));
}

export async function getProductsByCategory({ category, limit = 12, skip = 0, sortBy, order }) {
  const all = await getCatalog();
  const inCategory = all.filter((p) => p.category === category);
  return paginate(sortProducts(inCategory, sortBy, order), limit, skip);
}

// ---- CRUD ----
export function addProduct(payload) {
  return http.post("/products/add", payload, { auth: true });
}

export function updateProduct(id, payload) {
  return http.put(`/products/${id}`, payload, { auth: true });
}

export function deleteProduct(id) {
  return http.delete(`/products/${id}`, { auth: true });
}

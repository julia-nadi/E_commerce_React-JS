import { http } from "./http";

export function getCarts({ limit = 12, skip = 0 } = {}) {
  const params = new URLSearchParams({ limit, skip });
  return http.get(`/carts?${params.toString()}`);
}

export function getCart(id) {
  return http.get(`/carts/${id}`);
}

export function getCartsByUser(userId) {
  return http.get(`/carts/user/${userId}`);
}

// products: [{ id, quantity }]
export function addCart({ userId, products }) {
  return http.post("/carts/add", { userId, products }, { auth: true });
}

export function updateCart(id, { merge = true, products }) {
  return http.put(`/carts/${id}`, { merge, products }, { auth: true });
}

export function deleteCart(id) {
  return http.delete(`/carts/${id}`, { auth: true });
}

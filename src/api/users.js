import { http } from "./http";

export function getUsers({ limit = 12, skip = 0, sortBy, order } = {}) {
  const params = new URLSearchParams({ limit, skip });
  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order || "asc");
  }
  return http.get(`/users?${params.toString()}`);
}

export function getUser(id) {
  return http.get(`/users/${id}`);
}

export function searchUsers({ q, limit = 12, skip = 0 }) {
  const params = new URLSearchParams({ q, limit, skip });
  return http.get(`/users/search?${params.toString()}`);
}

// Filter users by a key/value, e.g. key="gender" value="female".
export function filterUsers({ key, value, limit = 12, skip = 0 }) {
  const params = new URLSearchParams({ key, value, limit, skip });
  return http.get(`/users/filter?${params.toString()}`);
}

// ---- CRUD (mock on DummyJSON) ----
export function addUser(payload) {
  return http.post("/users/add", payload, { auth: true });
}

export function updateUser(id, payload) {
  return http.put(`/users/${id}`, payload, { auth: true });
}

export function deleteUser(id) {
  return http.delete(`/users/${id}`, { auth: true });
}

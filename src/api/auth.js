import { http } from "./http";

// Glowy Store's demo account. DummyJSON can't create real users, so "julia" signs in
// with DummyJSON's "emilys" account behind the scenes and gets Julia's profile on top.
export const DEMO_ACCOUNT = { username: "julia", password: "juliapass" };
const BACKING_ACCOUNT = { username: "emilys", password: "emilyspass" };
const DEMO_PROFILE = {
  username: "julia",
  firstName: "Julia",
  lastName: "",
  email: "julia@glowystore.com",
};

function withDemoProfile(user) {
  return user?.username === BACKING_ACCOUNT.username ? { ...user, ...DEMO_PROFILE } : user;
}

// DummyJSON auth endpoints.
// Login returns { accessToken, refreshToken, ...userFields }.
export async function login({ username, password }) {
  const isDemo =
    username.trim().toLowerCase() === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password;
  const credentials = isDemo ? BACKING_ACCOUNT : { username, password };
  const data = await http.post("/auth/login", { ...credentials, expiresInMins: 60 });
  return withDemoProfile(data);
}

// Fetch the currently authenticated user (requires the bearer token).
export async function getAuthUser() {
  return withDemoProfile(await http.get("/auth/me", { auth: true }));
}

// DummyJSON has no persistent registration, so /users/add is a mock create.
export function register(payload) {
  return http.post("/users/add", payload);
}

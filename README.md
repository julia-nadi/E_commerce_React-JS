# ✨ Glowy Store — React E-Commerce Frontend

A complete, responsive e-commerce frontend built with **React**, **React Bootstrap**, and the
**[DummyJSON API](https://dummyjson.com)**. It covers authentication with token persistence,
product browsing (search, filtering, sorting, pagination), cart management, and a full admin
dashboard with CRUD for products, carts, and users.

## ✨ Features

### Authentication
- Login via the DummyJSON `/auth/login` endpoint with input validation.
- Mock registration flow (`/users/add`).
- **Token persistence** in `localStorage` — the session is restored on reload via `/auth/me`.
- Authenticated user profile page ("Get Auth User").
- Protected routes (dashboard & profile) that redirect guests to login.

### Products
- Full product listing with the "Get All Products" endpoint.
- Product details page (gallery, reviews, stock, pricing).
- Search (`/products/search`), pagination (`limit` & `skip`), category filtering, and sorting
  (price / rating / title).
- Category browsing from the home page.
- CRUD: add, update, and delete products (dashboard).

### Carts
- List all carts, view a single cart in detail, and fetch carts by user ID.
- CRUD: add and delete carts.
- Cart UI showing contents, totals, discounts, and item counts.
- A shopping cart (persisted locally) with a checkout that creates a real cart via the API.

### Users
- List all users with pagination, search (`/users/search`), and gender filtering
  (`/users/filter`).
- View single user details; delete users.

### Dashboard
- Sidebar navigation for Products, Carts, Users, and Authentication.
- Summary widgets (product / cart / user counts) and recent-activity tables.
- Tables + modal forms for every CRUD operation with confirmation dialogs.

### Design
- Built entirely with **React Bootstrap**, fully responsive, with a consistent custom theme.
- Toast notifications (react-hot-toast), loaders, and empty states throughout.

## 🧱 Tech Stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + Vite |
| UI | React Bootstrap 2 + Bootstrap 5 |
| Routing | React Router DOM 7 |
| State | Context API (Auth + Cart) |
| Notifications | react-hot-toast |
| API | DummyJSON |

## 📂 Project Structure

```
src/
├── api/            # DummyJSON API modules (http, auth, products, carts, users)
├── context/        # AuthContext (token persistence) + CartContext
├── components/
│   ├── common/     # Loader, EmptyState, Rating, PaginationBar, ConfirmModal
│   ├── layout/     # Navbar, Footer, PublicLayout
│   ├── dashboard/  # DashboardLayout + form/detail modals
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── pages/          # Home, Products, ProductDetails, Cart, Login, Register, Profile
│   └── dashboard/  # DashboardHome, ManageProducts, ManageCarts, ManageUsers
├── App.jsx         # Routes
└── main.jsx        # Providers + entry
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

Then open the printed local URL (default `http://localhost:5173`).

### Demo credentials

DummyJSON provides ready-made accounts. Use:

```
username: julia
password: juliapass
```

## ☁️ Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the repo on [Vercel](https://vercel.com) — it auto-detects Vite.
3. Build command `npm run build`, output directory `dist`.
4. `vercel.json` is included so client-side routes work on refresh (SPA rewrites).

## 📝 Notes & Known Issues

- DummyJSON is a **mock** API: create/update/delete requests return realistic responses but do
  **not** persist. New/edited items are shown optimistically in the current session and reset on
  reload — this is expected behavior of the API.
- Registration is a mock flow; use the demo credentials above to log in.

---

Built for educational purposes as a frontend e-commerce project.

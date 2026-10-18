import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

// Storefront shell: navbar + page content + footer.
export default function PublicLayout() {
  return (
    <>
      <AppNavbar />
      <main className="page-min">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

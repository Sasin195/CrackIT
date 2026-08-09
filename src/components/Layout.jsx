import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import Toasts from "./Toasts.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="app-content">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
      <Toasts />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen">
      <div className="mb-15">

      <Navbar />
      </div>
      <main >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
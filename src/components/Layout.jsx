import { useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

export default function Layout({
  children,
  onLogout,
  user,
}) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar
        user={user}
        onLogout={onLogout}
      />

      <main className="flex-1 pb-20 md:pb-4 pt-[76px]">

        <div className="w-full">
          {children}
        </div>

      </main>

      <Footer />

      <BottomNav />

    </div>
  );
}
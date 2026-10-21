import { X, Menu } from "lucide-react";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SignIn, useUser } from "@clerk/clerk-react";
import logo_name from "../assets/logo_name.png";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user, isLoaded } = useUser();

  // Wait for Clerk so the sign-in form doesn't flash for signed-in users
  if (!isLoaded) return <div className="h-screen bg-zinc-950" />;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen bg-zinc-950">
      {/* On desktop the logo lives in the sidebar header */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar is mobile-only: logo + menu toggle */}
        <header className="sm:hidden h-14 shrink-0 flex items-center justify-between px-4 border-b border-zinc-800">
          <img
            src={logo_name}
            alt="Evora"
            className="h-7 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          <button
            type="button"
            onClick={() => setSidebar(!sidebar)}
            aria-label={sidebar ? "Close menu" : "Open menu"}
            aria-expanded={sidebar}
            className="text-zinc-400 hover:text-zinc-100"
          >
            {sidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 min-h-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


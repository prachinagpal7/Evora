import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";
import { House, SquarePen, Hash, Image as ImageIcon, Eraser, Scissors, FileText, Users, LogOut,} from "lucide-react";
import logo_name from "../assets/logo_name.png";
import Logo from "./Logo"

const navGroups = [
  { items: [{ to: "/ai", label: "Dashboard", Icon: House }],},
  {
    label: "Tools",
    items: [
      { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
      { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
      { to: "/ai/generate-images", label: "Generate Images", Icon: ImageIcon },
      { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
      { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
      { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
    ],
  },
  { items: [{ to: "/ai/community", label: "Community", Icon: Users }],},
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <aside
      className={`w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between max-sm:absolute max-sm:top-14 max-sm:bottom-0 max-sm:left-0 max-sm:z-20 transition-transform duration-200 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      }`}
    >
      <div className="min-h-0 flex flex-col">
        {/* Logo header (desktop only, mobile has the top bar) */}
        <div className="max-sm:hidden h-14 shrink-0 px-6 flex items-center border-b border-zinc-800">
          {/* <img src={logo_name} alt="Evora" className="h-7 w-auto cursor-pointer" onClick={() => navigate("/")}/> */}
          <Logo />
        </div>

        <nav className="p-3 overflow-y-auto">
          {navGroups.map((group, i) => (
            <div
              key={i}
              className={i > 0 ? "mt-3 pt-3 border-t border-zinc-800" : ""}
            >
              {group.label && (
                <p className="px-3 pb-2 text-xs text-zinc-500">{group.label}</p>
              )}
              {group.items.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/ai"}
                  onClick={() => setSidebar(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-zinc-900 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-100"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`}
                      />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="shrink-0 border-t border-zinc-800 py-3 pl-6 pr-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => openUserProfile()}
          className="flex items-center gap-3 min-w-0 text-left"
        >
          <img
            src={user.imageUrl}
            alt=""
            className="w-8 h-8 rounded-full shrink-0"
          />
          <span className="min-w-0">
            <span className="block text-sm text-zinc-100 truncate capitalize">
              {user.fullName}
            </span>
            <span className="block text-xs text-zinc-500 font-mono">
              <Protect plan="premium" fallback="Free plan">
                Premium plan
              </Protect>
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => signOut()}
          aria-label="Sign out"
          className="p-2 text-zinc-500 hover:text-zinc-100"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

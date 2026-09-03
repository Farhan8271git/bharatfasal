import {
  Home,
  BarChart3,
  Package,
  Users,
  Settings,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: Home,
    },
    {
      label: "Prices",
      path: "/prices",
      icon: BarChart3,
    },
    {
      label: "My Lots",
      path: "/lots",
      icon: Package,
    },
    {
      label: "Buyers",
      path: "/buyers",
      icon: Users,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white
        border-t
        border-gray-200
        shadow-[0_-2px_10px_rgba(0,0,0,0.08)]
        md:hidden
      "
    >
      <div
        className="
          max-w-lg
          mx-auto
          h-20
          flex
          items-center
          justify-around
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                w-16
                h-full
                transition-colors
                duration-200
                ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-500 hover:text-green-600"
                }
              `}
            >
              <Icon
                size={23}
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span
                className={`
                  text-xs
                  ${
                    isActive
                      ? "font-semibold"
                      : "font-medium"
                  }
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
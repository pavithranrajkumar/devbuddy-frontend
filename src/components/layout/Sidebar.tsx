import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (window.innerWidth >= 600) {
        // lg breakpoint
        setIsOpen(true);
      }
    };

    const handleMouseLeave = () => {
      if (window.innerWidth >= 600) {
        setIsOpen(false);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("mouseenter", handleMouseEnter);
      sidebar.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("mouseenter", handleMouseEnter);
        sidebar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [setIsOpen]);

  const clientNavItems = [
    // {
    //   title: 'Dashboard',
    //   href: '/dashboard',
    //   icon: Icons.home,
    // },
    {
      title: "My Projects",
      href: "/projects/manage",
      icon: Icons.folder,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: Icons.user,
    },
  ];

  const freelancerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Icons.home,
    },
    {
      title: "Find Projects",
      href: "/projects",
      icon: Icons.search,
    },
    {
      title: "My Applications",
      href: "/applications",
      icon: Icons.fileText,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: Icons.user,
    },
  ];

  const navItems =
    user?.userType === "client" ? clientNavItems : freelancerNavItems;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg lg:z-auto",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-20",
          "transition-all duration-300"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Icons.logo className="h-6 w-6 text-primary" />
          {isOpen && <span className="text-lg font-semibold">DevBuddy</span>}
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                  isActive ||
                    (item.href === "/projects/manage" &&
                      window.location.pathname.startsWith("/projects"))
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <item.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "mr-0")} />
              <span
                className={cn(
                  "transition-all duration-300 whitespace-nowrap",
                  isOpen
                    ? "opacity-100 visible relative"
                    : "opacity-0 invisible absolute"
                )}
              >
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

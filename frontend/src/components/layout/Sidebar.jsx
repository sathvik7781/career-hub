import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Search, FileText, Briefcase, Building2, LayoutDashboard,
  PlusSquare, User, LogOut, X, Bookmark
} from "lucide-react";

const NAV_ITEMS = {
  seeker: [
    { to: "/dashboard",       icon: LayoutDashboard, label: "Dashboard"       },
    { to: "/jobs",            icon: Search,          label: "Find Jobs"       },
    { to: "/companies",       icon: Building2,       label: "Companies"       },
    { to: "/my-applications", icon: FileText,        label: "My Applications" },
    { to: "/saved-jobs",      icon: Bookmark,        label: "Saved Jobs"      },
    { to: "/profile",         icon: User,            label: "Profile"         },
  ],
  recruiter: [
    { to: "/dashboard",          icon: LayoutDashboard, label: "Dashboard"    },
    { to: "/recruiter/jobs",     icon: Briefcase,       label: "My Jobs"      },
    { to: "/recruiter/post-job", icon: PlusSquare,      label: "Post Job"     },
    { to: "/recruiter/company",  icon: Building2,       label: "Company"      },
    { to: "/profile",            icon: User,            label: "Profile"      },
  ],
  admin: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin",     icon: Building2,       label: "Companies" },
    { to: "/admin/jobs", icon: Briefcase,      label: "Jobs"      },
  ],
};

export default function Sidebar({ expanded, onClose, isMobile }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const items = NAV_ITEMS[user?.role] || [];
  const isActive = (path) => location.pathname === path;

  const showOverlay = isMobile && expanded;

  return (
    <>
      {/* Backdrop — tablet + mobile only */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-white dark:bg-slate-900
          border-r border-gray-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          ${isMobile
            ? expanded ? "w-64 translate-x-0" : "-translate-x-full w-64"
            : expanded ? "w-60 translate-x-0" : "w-16 translate-x-0"
          }
        `}
      >
        {/* Sidebar header — logo area aligns with navbar height */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
          {expanded && (
            <span className="text-sm font-bold text-primary tracking-tight">
              CareerHub
            </span>
          )}
          {(isMobile) && expanded && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ml-auto"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {items.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={isMobile ? onClose : undefined}
                title={!expanded ? label : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                {expanded && <span className="truncate">{label}</span>}
                {active && expanded && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="px-2 pb-4 border-t border-gray-200 dark:border-slate-800 pt-3">
          <button
            onClick={() => { logout(); if (onClose) onClose(); }}
            title={!expanded ? "Logout" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {expanded && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

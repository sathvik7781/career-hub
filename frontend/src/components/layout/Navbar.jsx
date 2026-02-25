import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import careerHubLogo from "../../assets/icons/careerHubLogo.png";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Briefcase,
  Building2,
  LayoutDashboard,
  FileText,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive(to)
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <img
              src={careerHubLogo}
              alt="CareerHub"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user?.role === "seeker" && (
              <>
                <NavLink to="/jobs" icon={Search} label="Find Jobs" />
                <NavLink
                  to="/my-applications"
                  icon={FileText}
                  label="My Applications"
                />
              </>
            )}

            {user?.role === "recruiter" && (
              <>
                <NavLink
                  to="/recruiter/jobs"
                  icon={Briefcase}
                  label="My Jobs"
                />
                <NavLink
                  to="/recruiter/company"
                  icon={Building2}
                  label="Company"
                />
              </>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin" icon={LayoutDashboard} label="Dashboard" />
            )}

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:block">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    // Optional: Redirect handled by protected route or user acts
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 border-b shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {user?.role === "seeker" && (
                <>
                  <MobileNavLink
                    to="/jobs"
                    icon={Search}
                    label="Find Jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/my-applications"
                    icon={FileText}
                    label="My Applications"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </>
              )}

              {user?.role === "recruiter" && (
                <>
                  <MobileNavLink
                    to="/recruiter/jobs"
                    icon={Briefcase}
                    label="My Jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/recruiter/company"
                    icon={Building2}
                    label="Company"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </>
              )}

              {user?.role === "admin" && (
                <MobileNavLink
                  to="/admin"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <MobileNavLink
                      to="/profile"
                      icon={User}
                      label="My Profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log out</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-4 px-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const MobileNavLink = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

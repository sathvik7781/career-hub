import React from "react";
import { Link } from "react-router-dom";
import careerHubLogo from "../assets/icons/careerHubLogo.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[50] bg-white shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.08)]">
      <div className="max-w-[80rem] mx-auto flex items-center justify-between px-[2rem] py-[0.75rem]">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={careerHubLogo}
            alt="Career Hub"
            className="h-[2.5rem] w-auto"
          />
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-[1rem]">
          {/* Login */}
          <Link
            to="/login"
            className="px-[1.25rem] py-[0.5rem] rounded-[0.5rem] text-primary border border-primary
                       hover:bg-primary hover:text-white transition"
          >
            Login
          </Link>

          {/* Register */}
          <Link
            to="/register"
            className="px-[1.25rem] py-[0.5rem] rounded-[0.5rem] bg-secondary text-white
                       hover:opacity-90 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

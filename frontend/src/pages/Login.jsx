import React from "react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  async function handleLogin(e) {
    e.preventDefault();
    await login(formData.email, formData.password);
  }

  return (
    <div className="flex h-full items-center justify-center bg-secondary px-[1.5rem]">
      <div
        className="w-full max-w-[28rem] animate-slideUp bg-white rounded-[1rem] px-[1.5rem] sm:px-[2rem] py-[1.5rem] sm:py-[2rem] 
                     border border-[rgba(0,0,0,0.06)] 
                     shadow-[0_10px_30px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,96,196,0.08)] 
                     hover:shadow-[0_14px_40px_rgba(0,0,0,0.15),0_0_0_2px_rgba(0,96,196,0.15)]
                     transition-shadow duration-300 relative"
      >
        <h1 className="text-[1.5rem] font-semibold mb-[0.25rem] tracking-tight">
          Sign in to Career Hub
        </h1>

        <p className="text-gray-500 mb-[1.5rem] text-[0.875rem]">
          Access your account and opportunities
        </p>
        <form onSubmit={handleLogin} className="space-y-[1rem]">
          <div>
            <label className="block text-[0.875rem] mb-[0.25rem]">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[0.875rem] mb-[0.25rem]">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:ring-2 focus:ring-primary"
            />
            <div className="text-right mt-[0.25rem]">
              <Link
                to="/forgot-password"
                className="text-[0.75rem] text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem] disabled:opacity-60">
            Login
          </button>
        </form>
        <p className="text-center text-[0.875rem] text-gray-600 mt-[1.25rem]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

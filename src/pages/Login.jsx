import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 md:px-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
            Sign in to <span className="text-blue-600">INDOBARA FLEET TRACKING</span>
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter your details to get sign in to your account.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between text-sm">
              <div></div>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow-sm transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <img
          src="/bg.jpg"
          alt="Mining Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

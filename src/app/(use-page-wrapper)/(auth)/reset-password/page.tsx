// src/app/(use-page-wrapper)/(auth)/reset-password/page.tsx

"use client"; // if this page uses hooks, otherwise omit for server component

import React, { useState } from "react";

export default function ResetPasswordPage() {
  // your state/hooks here
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // your reset logic
    setMessage("Check your email for reset instructions.");
  };

  return (
    <div className="...">
      <h1 className="text-xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Send reset link
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
    </div>
  );
}

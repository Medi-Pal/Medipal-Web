"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      // Redirect to reset password page with email (for OTP verification)
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-center items-center bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-primary">
        Forgot Password
      </h2>
      <p className="text-gray-600 text-center">
        Enter your email below to reset your password
      </p>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="email"
          className="grow text-black"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <button
        type="submit"
        className="btn btn-success w-full"
        disabled={loading}
      >
        {loading ? "Sending..." : "Reset Password"}
      </button>

      <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
        Back to login
      </Link>
    </form>
  );
}

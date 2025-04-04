"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [registrationNo, setRegistrationNo] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  

    // Replace with your actual login API endpoint
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Registration_No: registrationNo, password }),
    });

    if (response.ok) {
      // Redirect to /doctor/prescription upon successful login
      router.push("http://localhost:3000/doctor/prescription");
    } else {
      // Handle login failure (e.g., show error message)
      console.error("Login failed");
    }
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <label className="input input-bordered flex items-center gap-2">
          {/* SVG icon */}
          <input
            type="text"
            className="grow"
            placeholder="Medical License Number"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            required
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          {/* SVG icon */}
          <input
            type="password"
            className="grow"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn-success w-full">
          Login
        </button>
      </form>
    </div>
  );
}

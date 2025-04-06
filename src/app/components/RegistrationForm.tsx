'use client'; // 👈 Add this line first!

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistrationForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    Name: '',
    Specialisation: '',
    ContactNumber: '',
    Email: '',
    password: '',
    ConfirmPassword: '',
    Registration_No: '',
    medicalLicenseFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.ConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) payload.append(key, value);
    });

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: payload,
      });

      console.log("Status:", response.status);
      const responseData = await response.json().catch(() => ({}));
      console.log("Response:", responseData);

      if (!response.ok) {
        alert(responseData.message || "Registration failed.");
        return;
      }

      alert("Registration successful!");
      router.push('/login');
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-center items-center w-full">
      {/* Name */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Name"
          required
        />
      </label>

      {/* Specialization */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          name="Specialisation"
          value={formData.Specialisation}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Specialization"
          required
        />
      </label>

      {/* Phone Number */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="tel"
          name="ContactNumber"
          value={formData.ContactNumber}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Phone Number"
          maxLength={10}
          required
        />
      </label>

      {/* Email */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Email"
          required
        />
      </label>

      {/* Password */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Password"
          required
        />
      </label>

      {/* Confirm Password */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="password"
          name="ConfirmPassword"
          value={formData.ConfirmPassword}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Confirm Password"
          required
        />
      </label>

      {/* Registration Number */}
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          name="Registration_No"
          value={formData.Registration_No}
          onChange={handleChange}
          className="grow text-black"
          placeholder="Registration Number"
          required
        />
      </label>

      {/* License File Upload */}
      <label className="flex flex-col gap-1 w-full">
        <span className="font-semibold text-gray-800">Medical License Upload:</span>
        <input
          type="file"
          name="medicalLicenseFile"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          className="text-black"
          required
        />
      </label>

      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
};

export default RegistrationForm;

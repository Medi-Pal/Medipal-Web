'use client'; // 👈 Add this line first!

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// List of common medical specializations
const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "Geriatric Medicine",
  "Gynecology",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Otolaryngology",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology"
];

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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle files separately since they're only in input elements
    if (name === 'medicalLicenseFile' && 'files' in e.target) {
      const files = (e.target as HTMLInputElement).files;
      setFormData(prevData => ({
        ...prevData,
        [name]: files ? files[0] : null
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.ConfirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // First, upload the license file to Cloudinary
      if (!formData.medicalLicenseFile) {
        setError("Medical license file is required");
        setLoading(false);
        return;
      }

      // Create a form data object for the license upload
      const licenseFormData = new FormData();
      licenseFormData.append('file', formData.medicalLicenseFile);

      // Upload the license to Cloudinary
      const uploadResponse = await fetch('/api/upload/license', {
        method: 'POST',
        body: licenseFormData,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error || "Failed to upload license");
      }

      const { url: licenseImageUrl } = await uploadResponse.json();

      // Now create a payload for doctor registration with the license URL
      const registrationPayload = {
        Name: formData.Name,
        Specialisation: formData.Specialisation,
        ContactNumber: formData.ContactNumber,
        Email: formData.Email,
        password: formData.password,
        Registration_No: formData.Registration_No,
        licenseImageUrl: licenseImageUrl,
      };

      // Register the doctor with the license URL
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Registration failed.");
      }

      alert("Registration successful!");
      router.push('/login');
    } catch (err) {
      console.error("Registration error:", err);
      setError((err as Error).message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-center items-center w-full">
      {error && (
        <div className="alert alert-error w-full">
          <span className="text-white">{error}</span>
        </div>
      )}
      
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

      {/* Specialization Dropdown */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-gray-700">Specialization</span>
        </label>
        <select
          name="Specialisation"
          value={formData.Specialisation}
          onChange={handleChange}
          className="select select-bordered w-full text-gray-800"
          required
        >
          <option value="" disabled>Select your specialization</option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>

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
          accept=".pdf,.jpg,.png,.jpeg"
          className="text-black file-input file-input-bordered w-full"
          required
        />
        <p className="text-xs text-gray-500">Upload your medical license (PDF, JPG, PNG format only)</p>
      </label>

      <button 
        type="submit" 
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Registering...
          </>
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;

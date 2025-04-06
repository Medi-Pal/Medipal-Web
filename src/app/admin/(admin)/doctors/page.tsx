"use client";
import AdminDoctorTable from "@/app/components/AdminDoctorTable";
import { Doctor } from "../../../../../utils/types";
import { useEffect, useState } from "react";

export default function () {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Add cache: 'no-store' to prevent caching
      const response = await fetch("/api/admin/doctors", {
        cache: 'no-store',
        headers: {
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError("Failed to load doctors");
      console.error("Error loading doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center text-error p-4 mb-4">{error}</div>
        <button
          onClick={fetchDoctors}
          className="btn btn-primary"
          disabled={loading}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-10">
      <AdminDoctorTable doctors={doctors} />
    </div>
  );
}

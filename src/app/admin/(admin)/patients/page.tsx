"use client";
import AdminPatientTable from "@/app/components/AdminPatientTable";
import { PatientDetails } from "../../../../../utils/types";
import { useEffect, useState } from "react";

export default function () {
  const [patients, setPatients] = useState<PatientDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("/api/admin/patients");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError("Failed to load patients");
        console.error("Error loading patients:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-error p-4">{error}</div>;
  }

  return (
    <div>
      <AdminPatientTable patients={patients} />
    </div>
  );
}

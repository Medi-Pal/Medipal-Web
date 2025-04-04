"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Prescription = {
  id: number;
  createdOn: string;
  doctor_regNo: {
    Name: string;
    Specialisation: string;
    ContactNumber: string;
  };
  patient_contact: {
    Name: string;
    Age: number | null;
    PhoneNumber: string;
    City: string | null;
    State: string;
    Country: string;
  };
  medicine_list: Array<{
    medicine: {
      brandName: string;
      drugName: string;
      type: string | null;
    };
    dosageType: string;
    duration: number | null;
    instruction: string | null;
    times: Array<{
      timeOfDay: string;
      dosage: number;
    }>;
  }>;
};

export default function PrescriptionHistory() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "recent" | "patient">("all");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch("/api/prescriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patient_contact.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient_contact.PhoneNumber.includes(searchTerm) ||
      prescription.medicine_list.some(med =>
        med.medicine.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.medicine.drugName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedFilter === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && new Date(prescription.createdOn) >= thirtyDaysAgo;
    }

    return matchesSearch;
  });

  const handleViewPrescription = (id: number) => {
    router.push(`/doctor/prescription/qr?id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
  return (
      <div className="alert alert-error">
        <span>{error}</span>
    </div>
  );
}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Past Prescriptions</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by patient name, phone, or medicine..."
            className="input input-bordered w-full md:w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-bordered"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as "all" | "recent" | "patient")}
          >
            <option value="all">All Time</option>
            <option value="recent">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No prescriptions found
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="card-title text-gray-800">
                      Patient: {prescription.patient_contact.Name}
                    </h2>
                    <p className="text-gray-600">
                      Phone: {prescription.patient_contact.PhoneNumber}
                    </p>
                    <p className="text-gray-600">
                      Date: {new Date(prescription.createdOn).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
        <button
                      className="btn btn-primary"
                      onClick={() => handleViewPrescription(prescription.id)}
        >
                      View Details
        </button>
      </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Medicines:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prescription.medicine_list.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800">
                          {med.medicine.brandName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {med.medicine.drugName}
                          {med.medicine.type && ` (${med.medicine.type})`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
        </div>
          ))
      )}
      </div>
    </div>
  );
}

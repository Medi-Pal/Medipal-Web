"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useSession } from "next-auth/react";

const prescriptionSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  patientPhone: z.string().min(10, "Valid phone number is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  medicines: z.array(z.object({
    medicineId: z.number().min(1, "Please select a medicine"),
    dosageType: z.enum(["ml", "drop", "tablet"]),
    times: z.array(z.object({
      timeOfDay: z.string(),
      dosage: z.number().min(1)
    })).min(1, "At least one time of day must be selected"),
    duration: z.number().nullable(),
    instruction: z.string().nullable()
  }))
});

interface Medicine {
  Serial_No: number;
  brandName: string;
  drugName: string;
  type?: string;
  description?: string;
}

interface MedicineTime {
  timeOfDay: string;
  dosage: number;
}

interface SelectedMedicine {
  medicineId: number;
  dosageType: "ml" | "drop" | "tablet";
  times: MedicineTime[];
  duration: number | null;
  instruction: string | null;
}

export default function PrescriptionForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [patientData, setPatientData] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    city: "",
    state: "",
    country: "",
    diagnosis: ""
  });
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);

  useEffect(() => {
    fetch("/api/medicines")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setMedicines(data);
      })
      .catch((err) => {
        console.error("Failed to fetch medicines:", err);
        setError("Failed to load medicines");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const prescriptionData = {
        patientContact: patientData.phoneNumber,
        patientDetails: {
          name: patientData.name,
          phoneNumber: patientData.phoneNumber,
          age: patientData.age,
          city: patientData.city,
          state: patientData.state || "Unknown",
          country: patientData.country || "Unknown",
          diagnosis: patientData.diagnosis,
        },
        medicines: selectedMedicines.map(med => ({
          medicineId: med.medicineId,
          dosageType: med.dosageType,
          times: med.times,
          duration: med.duration,
          instruction: med.instruction || null
        }))
      };

      const response = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create prescription");
      }

      router.push(`/doctor/prescription/qr?id=${data.id}`);
    } catch (error) {
      console.error("Prescription creation error:", error);
      setError(error instanceof Error ? error.message : "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="alert alert-error mb-4">
          <span className="text-white">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="text-gray-700">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-gray-800 bg-white"
                value={patientData.name}
                onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="text-gray-700">Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full text-gray-800 bg-white"
                value={patientData.phoneNumber}
                onChange={(e) => setPatientData({ ...patientData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="text-gray-700">Diagnosis</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-gray-800 bg-white"
                value={patientData.diagnosis}
                onChange={(e) => setPatientData({ ...patientData, diagnosis: e.target.value })}
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Prescription Details</h2>
          {selectedMedicines.map((med, index) => (
            <div key={index} className="p-6 border-2 border-base-200 rounded-xl space-y-4 bg-base-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <label className="label">
                    <span className="text-gray-700 font-medium">Select Medicine</span>
                  </label>
                  <select
                    className="select select-bordered w-full text-gray-800 bg-white"
                    value={med.medicineId}
                    onChange={(e) => {
                      const newMeds = [...selectedMedicines];
                      newMeds[index].medicineId = parseInt(e.target.value);
                      setSelectedMedicines(newMeds);
                    }}
                    required
                  >
                    <option value="">Select Medicine</option>
                    {medicines.map((m) => (
                      <option key={m.Serial_No} value={m.Serial_No}>
                        {m.brandName} ({m.drugName})
                        {m.type ? ` - ${m.type}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn btn-error btn-sm self-end"
                  onClick={() => {
                    const newMeds = selectedMedicines.filter((_, i) => i !== index);
                    setSelectedMedicines(newMeds);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label">
                    <span className="text-gray-700 font-medium">Dosage Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full text-gray-800 bg-white"
                    value={med.dosageType}
                    onChange={(e) => {
                      const newMeds = [...selectedMedicines];
                      newMeds[index].dosageType = e.target.value as "ml" | "drop" | "tablet";
                      setSelectedMedicines(newMeds);
                    }}
                    required
                  >
                    <option value="ml">Milliliters (ml)</option>
                    <option value="drop">Drops</option>
                    <option value="tablet">Tablets</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="text-gray-700 font-medium">Duration</span>
                    <span className="label-text-alt text-gray-500">(number of doses)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered w-full text-gray-800 bg-white"
                    value={med.duration || ""}
                    onChange={(e) => {
                      const newMeds = [...selectedMedicines];
                      newMeds[index].duration = parseInt(e.target.value) || null;
                      setSelectedMedicines(newMeds);
                    }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-700 font-medium">Timing & Dosage</label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const newMeds = [...selectedMedicines];
                      newMeds[index].times.push({
                        timeOfDay: "morning",
                        dosage: 1
                      });
                      setSelectedMedicines(newMeds);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Time
                  </button>
                </div>
                <div className="space-y-3">
                  {med.times.map((time, timeIndex) => (
                    <div key={timeIndex} className="flex gap-4 items-center bg-base-200 p-3 rounded-lg">
                      <select
                        className="select select-bordered flex-1 text-gray-800 bg-white"
                        value={time.timeOfDay}
                        onChange={(e) => {
                          const newMeds = [...selectedMedicines];
                          newMeds[index].times[timeIndex].timeOfDay = e.target.value;
                          setSelectedMedicines(newMeds);
                        }}
                        required
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                      </select>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          className="input input-bordered w-full text-gray-800 bg-white"
                          placeholder="Dosage amount"
                          value={time.dosage || ""}
                          onChange={(e) => {
                            const newMeds = [...selectedMedicines];
                            newMeds[index].times[timeIndex].dosage = parseFloat(e.target.value) || 0;
                            setSelectedMedicines(newMeds);
                          }}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => {
                          const newMeds = [...selectedMedicines];
                          newMeds[index].times = newMeds[index].times.filter((_, i) => i !== timeIndex);
                          setSelectedMedicines(newMeds);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="label">
                  <span className="text-gray-700 font-medium">Special Instructions</span>
                  <span className="label-text-alt text-gray-500">(optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full text-gray-800 bg-white min-h-[80px]"
                  placeholder="Enter any special instructions or notes for this medicine..."
                  value={med.instruction || ""}
                  onChange={(e) => {
                    const newMeds = [...selectedMedicines];
                    newMeds[index].instruction = e.target.value;
                    setSelectedMedicines(newMeds);
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary w-full mt-6"
            onClick={() => {
              setSelectedMedicines([
                ...selectedMedicines,
                {
                  medicineId: 0,
                  dosageType: "tablet",
                  times: [{ timeOfDay: "morning", dosage: 1 }],
                  duration: null,
                  instruction: null
                }
              ]);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Medicine
          </button>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-lg w-48 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Prescription"}
          </button>
        </div>
      </div>
    </form>
  );
}

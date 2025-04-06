"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

export default function EditPrescriptionPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: session } = useSession();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [medicines, setMedicines] = useState<Medicine[]>([]);

    const [patientData, setPatientData] = useState({
        name: "",
        phoneNumber: "",
        diagnosis: "",
        age: "",
        city: "",
        state: "",
        country: "",
    });

    const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
    const [originalPrescription, setOriginalPrescription] = useState<any>(null);

    // Fetch prescription data
    useEffect(() => {
        if (!id) return;

        const fetchPrescription = async () => {
            try {
                const response = await fetch(`/api/prescription/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch prescription");
                }

                const prescriptionData = await response.json();
                setOriginalPrescription(prescriptionData);

                // Set patient data
                setPatientData({
                    name: prescriptionData.patient_contact.Name,
                    phoneNumber: prescriptionData.patient_contact.PhoneNumber,
                    diagnosis: prescriptionData.diagnosis || "",
                    age: prescriptionData.patient_contact.Age?.toString() || "",
                    city: prescriptionData.patient_contact.City || "",
                    state: prescriptionData.patient_contact.State || "",
                    country: prescriptionData.patient_contact.Country || "",
                });

                // Set medicine data
                const formattedMedicines = prescriptionData.medicine_list.map((med: any) => ({
                    medicineId: med.medicine.Serial_No,
                    dosageType: med.dosageType,
                    times: med.times,
                    duration: med.duration,
                    instruction: med.instruction
                }));

                setSelectedMedicines(formattedMedicines);
            } catch (error) {
                console.error("Error fetching prescription:", error);
                setError("Failed to load prescription details");
            } finally {
                setLoading(false);
            }
        };

        fetchPrescription();
    }, [id]);

    // Fetch medicines list
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
        setSubmitting(true);

        try {
            // Validate data
            if (selectedMedicines.length === 0) {
                throw new Error("At least one medicine is required");
            }

            if (!patientData.name || !patientData.phoneNumber) {
                throw new Error("Patient name and phone number are required");
            }

            // Prepare data for update
            const updateData = {
                id: id,
                patientContact: patientData.phoneNumber,
                patientDetails: {
                    name: patientData.name,
                    phoneNumber: patientData.phoneNumber,
                    age: patientData.age ? parseInt(patientData.age) : null,
                    city: patientData.city || null,
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

            console.log("Sending update data with diagnosis:", patientData.diagnosis);

            // Send update request
            const response = await fetch(`/api/prescription/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to update prescription");
            }

            // Redirect back to prescription details
            router.push(`/doctor/prescription/qr?id=${id}`);
        } catch (error) {
            console.error("Prescription update error:", error);
            setError(error instanceof Error ? error.message : "Failed to update prescription");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error && !originalPrescription) {
        return (
            <div className="alert alert-error max-w-4xl mx-auto mt-8">
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Edit Prescription</h1>

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
                                                    ✕
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
                            Add New Medicine
                        </button>
                    </section>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => router.push(`/doctor/prescription/qr?id=${id}`)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-48 text-lg font-semibold"
                            disabled={submitting}
                        >
                            {submitting ? "Updating..." : "Update Prescription"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
} 
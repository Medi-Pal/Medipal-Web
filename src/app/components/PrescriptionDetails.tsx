import { Medicine, Patient } from "../../../utils/types";

export default function PrescriptionDetails() {
  const prescription = {
    patient: {
      name: "Sahil Dcunha",
      age: 20,
      gender: "Male",
      contact: 8998992349,
      date: new Date().toLocaleDateString(),
      diagnosis: "Fever",
      address: "Mapusa",
    },
    medicines: [
      {
        name: "Benadryl",
        dosageType: "ml",
        frequency: {
          morning: 5,
          afternoon: 0,
          night: 5,
        },
        duration: 5,
      },
      {
        name: "Combiflam",
        dosageType: "tablet",
        frequency: {
          morning: 0,
          afternoon: 0,
          night: 0,
          other: "For pain",
        },
        duration: 1,
      },
    ],
    doctor: {
      name: "Dr. Ravish Kolvalkar",
      contact: 9139281234,
      notes: "Meet doctor in 5 days if fever is still high.",
    },
  };
  return (
    <div className="border-4 border-dashed flex flex-col p-6 gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text text-2xl border-b-2">Patient Details:</h2>
        <PatientDetails patient={prescription.patient} />
      </div>
      <div className="flex flex-col">
        <h2 className="text text-2xl border-b-2">Medicines:</h2>
        <div>
          {prescription.medicines.map((medicine) => {
            return <MedicineDetails key={medicine.name} medicine={medicine} />;
          })}
        </div>
      </div>
    </div>
  );
}

function MedicineDetails({ medicine }: { medicine: Medicine }) {
  return <div></div>;
}

function PatientDetails({ patient }: { patient: Patient }) {
  return (
    <div className="flex flex-col justify-start gap-2">
      <p className="text text-lg">Patient: {patient.name}</p>
      <p className="text text-base">Phone: {patient.contact}</p>
      <p className="text text-base">Age: {patient.age}</p>
      <p className="text text-base">{patient.gender}</p>
      <p>Date: {patient.date}</p>
      <p>Address: {patient.address}</p>
    </div>
  );
}

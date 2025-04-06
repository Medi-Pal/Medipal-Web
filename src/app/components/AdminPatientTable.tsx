import { PatientDetails } from "../../../utils/types";
import ConfirmDeletePatient from "./ConfirmDeletePatient";

export default function ({ patients }: { patients: PatientDetails[] }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Patient Records</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="table w-full">
            <thead>
              <tr className="bg-blue-600">
                <th className="text-base font-semibold text-white p-4">Phone Number</th>
                <th className="text-base font-semibold text-white p-4">Name</th>
                <th className="text-base font-semibold text-white p-4">Age</th>
                <th className="text-base font-semibold text-white p-4">City</th>
                <th className="text-base font-semibold text-white p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                return <PatientTableItem patient={patient} key={patient.id} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PatientTableItem({ patient }: { patient: PatientDetails }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="text-base font-medium text-gray-900 p-4">{patient.phoneNumber}</td>
      <td className="text-base text-gray-900 p-4">{patient.name}</td>
      <td className="text-base text-gray-900 p-4">{patient.age || 'N/A'}</td>
      <td className="text-base text-gray-900 p-4">{patient.city || 'N/A'}</td>
      <td className="p-4">
        <ConfirmDeletePatient patient={patient}>
          <button className="btn bg-red-600 hover:bg-red-700 text-white border-none btn-sm">
            Delete
          </button>
        </ConfirmDeletePatient>
      </td>
    </tr>
  );
}

import { PatientDetails } from "../../../utils/types";
import ConfirmDeletePatient from "./ConfirmDeletePatient";

export default function ({ patients }: { patients: PatientDetails[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="text text-lg">Patient Id</th>
            <th className="text text-lg">Name</th>
            <th className="text text-lg">Phone Number</th>
            <th className="text text-lg">Delete Records</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            return <PatientTableItem patient={patient} key={`${patient.id}`} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function PatientTableItem({ patient }: { patient: PatientDetails }) {
  return (
    <tr>
      <td className="text text-base">{patient.id}</td>
      <td className="text text-base">{patient.name}</td>
      <td className="text text-base">{patient.phoneNumber}</td>
      <td>
        <ConfirmDeletePatient patient={patient}>
          <button className="btn btn-error">Delete</button>
        </ConfirmDeletePatient>
      </td>
    </tr>
  );
}

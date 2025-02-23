import { randomUUID } from "crypto";
import ConfirmDelete from "./ConfirmDelete";
import { DownloadIcon } from "./AdminDoctorTable";

export default function EditDoctorDetails() {
  const doctor = {
    id: randomUUID(),
    name: "Gaurish Laad",
    specialisation: "Dermatologist",
    phoneNumber: 12123123,
    email: "gaurishlaad@gmail.com",
    medicalLicense: "234827198127",
    status: false,
  };
  return (
    <div className="flex flex-col max-w-fit gap-3 justify-center p-8 border-2 rounded-3xl shadow-lg">
      <h2 className="text text-2xl font-extrabold text-center">
        Doctor Details
      </h2>
      <p className="text text-md">Update the details below</p>
      <div className="flex flex-col gap-2">
        <InputItem field="Name" value={doctor.name} />
        <InputItem field="Phone Number" value={doctor.phoneNumber.toString()} />
        <InputItem field="Specialisation" value={doctor.specialisation} />
        <InputItem field="Email" value={doctor.email} />
      </div>
      <button className="btn btn-neutral">
        <DownloadIcon />
        Medical License
      </button>
      {doctor.status ? (
        <button className="btn btn-warning w-full">Revoke</button>
      ) : (
        <button className="btn btn-primary w-full">Approve</button>
      )}
      <button className="btn btn-accent">Update</button>
      <ConfirmDelete doctor={doctor}>
        <button className="btn btn-error">Delete</button>
      </ConfirmDelete>
    </div>
  );
}

function InputItem({ field, value }: { field: string; value: string }) {
  return (
    <div>
      <p className="text text-sm font-bold">{field}</p>
      <input type="text" className="input input-bordered" placeholder={value} />
    </div>
  );
}

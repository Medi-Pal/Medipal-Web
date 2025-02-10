import AdminDoctorTable from "@/app/components/AdminDoctorTable";
import { Doctor } from "../../../../../utils/types";

export default function () {
  const listOfDoctors: Doctor[] = [
    {
      name: "Gaurish Laad",
      specialisation: "Dermatologist",
      phoneNumber: 12123123,
      medicalLicense: "234827198127",
      status: false,
    },
    {
      name: "Radhika Apte",
      specialisation: "Pediatrician",
      phoneNumber: 12312312321,
      medicalLicense: "09341723894",
      status: false,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <p className="text text-xl p-4">Pending Registrations</p>
      <AdminDoctorTable doctors={listOfDoctors} />
    </div>
  );
}

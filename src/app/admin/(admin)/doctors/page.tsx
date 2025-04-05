import AdminDoctorTable from "@/app/api/admin/doctors/AdminDoctorTable";
import { Doctor } from "../../../../../utils/types";
import { randomUUID, UUID } from "crypto";

export default function () {
  const listOfDoctors: Doctor[] = [
    {
      id: randomUUID(),
      name: "Gaurish Laad",
      specialisation: "Dermatologist",
      phoneNumber: 12123123,
      medicalLicense: "234827198127",
      status: false,
    },
    {
      id: randomUUID(),
      name: "Radhika Apte",
      specialisation: "Pediatrician",
      phoneNumber: 12312312321,
      medicalLicense: "09341723894",
      status: false,
    },
    {
      id: randomUUID(),
      name: "Radhika Apte",
      specialisation: "Pediatrician",
      phoneNumber: 12312312321,
      medicalLicense: "09341723894",
      status: true,
    },
    {
      id: randomUUID(),
      name: "Radhika Apte",
      specialisation: "Pediatrician",
      phoneNumber: 12312312321,
      medicalLicense: "09341723894",
      status: true,
    },
  ];
  return (
    <div className="flex flex-col py-10">
      <AdminDoctorTable doctors={listOfDoctors} />
    </div>
  );
}

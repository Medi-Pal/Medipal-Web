import AdminDoctorTable from "@/app/components/AdminDoctorTable";
import { Doctor } from "../../../../utils/types";

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
    {
      name: "Radhika Apte",
      specialisation: "Pediatrician",
      phoneNumber: 12312312321,
      medicalLicense: "09341723894",
      status: true,
    },
    {
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

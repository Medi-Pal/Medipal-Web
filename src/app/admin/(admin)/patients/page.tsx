"use client";
import AdminPatientTable from "@/app/components/AdminPatientTable";
import { PatientDetails } from "../../../../../utils/types";
import { v4 as uuid } from "uuid";

export default function () {
  const patients: PatientDetails[] = [
    {
      id: uuid(),
      name: "Sahil Dcunha",
      phoneNumber: 9870981343,
    },
    {
      id: uuid(),
      name: "Riyan Mohammad",
      phoneNumber: 8941758191,
    },
    {
      id: uuid(),
      name: "Hardik Naik",
      phoneNumber: 9765098734,
    },
  ];
  return (
    <div>
      <AdminPatientTable patients={patients} />
    </div>
  );
}

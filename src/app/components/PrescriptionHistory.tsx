"use client";
import { v4 } from "uuid";
import { Prescription } from "../../../utils/types";
import { useState } from "react";
import Link from "next/link";

export default function () {
  const prescriptions = [
    {
      id: v4(),
      patient: {
        id: v4(),
        name: "Sahil Dcunha",
        contact: 9870981343,
        age: 20,
        gender: "Male",
        date: new Date().toLocaleDateString(),
        diagnosis: "Fever",
        address: "Mapusa",
      },
      medicine: [
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
        name: "Dr. Gaurish Laad",
        phoneNumber: 9139281234,
      },
    },
    {
      id: v4(),
      patient: {
        id: v4(),
        name: "Hardik Naik",
        contact: 9870981343,
        age: 24,
        gender: "Male",
        date: new Date().toLocaleDateString(),
        diagnosis: "Food Poisoning",
        address: "Mapusa",
      },
      medicine: [
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
          name: "Anti biotic",
          dosageType: "tablet",
          frequency: {
            morning: 1,
            afternoon: 1,
            night: 1,
          },
          duration: 4,
        },
      ],
      doctor: {
        name: "Dr. Gaurish Laad",
        phoneNumber: 9139281124,
      },
    },
  ];
  return (
    <div className="flex flex-col p-4 justify-between gap-6">
      <h1 className="text text-2xl">Past Prescriptions:</h1>
      {prescriptions.map((prescription) => {
        return <PrescriptionRecordItem prescription={prescription} />;
      })}
    </div>
  );
}

function PrescriptionRecordItem({ prescription }: { prescription: any }) {
  const [show, setShow] = useState(false);
  return (
    <div className="border-2 p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 justify-between items-center text-start gap-3">
        <p>
          <span className="text font-semibold">Diagnosis:</span>{" "}
          {prescription.patient.diagnosis}
        </p>
        <p>
          <span className="text font-semibold">Prescription Id:</span>{" "}
          {prescription.id}
        </p>
        <p>
          <span className="text font-semibold">Date:</span>{" "}
          {prescription.patient.date}
        </p>
        <button
          className="btn btn-info"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Show less" : "Show more"}
        </button>
      </div>
      {show ? (
        <div className="grid grid-cols-1 md:grid-cols-4 justify-between items-center text-start gap-3">
          <p>
            <span className="text font-semibold">Diagnosed by: </span>
            {prescription.doctor.name}
          </p>
          <p>
            <span className="text font-semibold">Patient Name: </span>
            {prescription.patient.name}
          </p>
          <p></p>
          <Link href={"/doctor/prescription/qr"} className="btn btn-primary">
            <button>See Receipt</button>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

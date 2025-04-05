"use client";
import { Key } from "react";
import { Doctor } from "../../../../../utils/types";
import Link from "next/link";

export interface TableItemProps {
  doctor: Doctor;
  key: Key;
}

export default function ({ doctors }: { doctors: Doctor[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="text text-lg">Name</th>
            <th className="text text-lg">Specialisation</th>
            <th className="text text-lg">Phone Number</th>
            <th className="text text-lg">Verification Status</th>
            <th className="text text-lg">Medical License</th>
            <th className="text text-lg">Update</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => {
            return (
              <TableItem doctor={doctor} key={`${doctor.medicalLicense}`} />
            );
          })}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
}

function TableItem({ doctor }: TableItemProps) {
  return (
    <tr>
      <td>
        <div className="text text-base">{doctor.name}</div>
      </td>
      <td className="text text-base">{doctor.specialisation}</td>
      <td className="text text-base">{doctor.phoneNumber.toString()}</td>
      <td className="text text-base">
        {doctor.status ? "Verified" : "Unverified"}
      </td>
      <td>
        <button className="btn btn-neutral">
          <DownloadIcon />
        </button>
      </td>
      <td>
        <Link href={`/admin/doctors/${doctor.id}`}>
          <button className="btn btn-accent">Update</button>
        </Link>
      </td>
    </tr>
  );
}

export function DownloadIcon() {
  return (
    <>
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#2b883d"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="Interface / Download">
            {" "}
            <path
              id="Vector"
              d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
              stroke="#13a023"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
          </g>{" "}
        </g>
      </svg>
    </>
  );
}

"use client";
import { Key } from "react";
import { Doctor } from "../../../utils/types";
import ConfirmDelete from "./ConfirmDelete";

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
            <th className="text text-base pl-8">Name</th>
            <th className="text text-base">Specialisation</th>
            <th className="text text-base">Phone Number</th>
            <th className="text text-base">Verification Status</th>
            <th className="text text-base">Medical License</th>
            <th className="text text-base">Download License</th>
            <th className="text text-base">Change Authority</th>
            <th className="text text-base">Delete A/C</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => {
            return <TableItem doctor={doctor} key={`${doctor.name}`} />;
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
        <div className="flex items-center gap-3">
          <div className="avatar"></div>
          <div>
            <div className="font-bold text text-lg">{doctor.name}</div>
          </div>
        </div>
      </td>
      <td className="font-semibold text text-lg">{doctor.specialisation}</td>
      <td className="font-semibold text text-lg">
        {doctor.phoneNumber.toString()}
      </td>
      <td className="font-semibold text text-lg">
        {doctor.status ? "Verified" : "Unverified"}
      </td>
      <td className="font-semibold text text-lg">{doctor.medicalLicense}</td>
      <td>
        <button className="btn btn-neutral">
          <DownloadIcon />
        </button>
      </td>
      {doctor.status ? (
        <td>
          <button className="btn btn-warning">Revoke</button>
        </td>
      ) : (
        <td>
          <button className="btn btn-primary">Approve</button>
        </td>
      )}
      <td>
        <ConfirmDelete doctor={doctor}>
          <button className="btn btn-error">Delete</button>
        </ConfirmDelete>
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

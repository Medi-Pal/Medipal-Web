"use client";
import { PatientDetails } from "../../../utils/types";

export default function ({
  patient,
  children,
}: {
  patient: PatientDetails;
  children: React.ReactNode;
}) {
  return (
    <>
      <ModalButton patient={patient} />
      <dialog id="modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="text text-xl text-semibold py-4">
            Do you want to delete the account of {patient.name}
          </p>
          <div className="modal-action">
            <form method="dialog flex">
              <button className="btn mr-4">Close</button>
              <button className="btn btn-primary">Confirm</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function ModalButton({ patient }: { patient: PatientDetails }) {
  return (
    <button
      className="btn btn-error"
      onClick={() => {
        document.getElementById("modal").showModal();
      }}
    >
      Delete
    </button>
  );
}

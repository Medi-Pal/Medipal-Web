"use client";
import { Doctor } from "../../../utils/types";

export default function ({ doctor }: { doctor: Doctor }) {
  return (
    <>
      <ModalButton doctor={doctor} />
      <dialog id="modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="text text-xl text-semibold py-4">
            Do you want to delete the account of {doctor.name}
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

export function ModalButton({ doctor }: { doctor: Doctor }) {
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

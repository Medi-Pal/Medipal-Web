"use client";
import { PatientDetails } from "../../../utils/types";
import { useState } from "react";

export default function ConfirmDeletePatient({
  children,
  patient,
}: {
  children: React.ReactNode;
  patient: PatientDetails;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/admin/patients/${patient.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      // Refresh the page to show updated list
      window.location.reload();
    } catch (err) {
      setError("Failed to delete patient. Please try again.");
      console.error("Error deleting patient:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the record for patient{" "}
              <span className="font-semibold">{patient.name}</span>? This action
              cannot be undone.
            </p>
            {error && (
              <div className="text-error text-sm mb-4">{error}</div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-ghost"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

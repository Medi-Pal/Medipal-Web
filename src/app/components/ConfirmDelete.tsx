"use client";
import { useState } from "react";
import { Doctor } from "../../../utils/types";
import { useRouter } from "next/navigation";

export default function ({
  doctor,
  children,
}: {
  doctor: Doctor;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/doctors/${doctor.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete doctor');
      }

      // Close the modal using HTML dialog method
      const modal = document.getElementById("confirm-delete-modal") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      // Show success message
      alert('Doctor deleted successfully');

      // Redirect back to doctors list
      router.push('/admin/doctors');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div onClick={() => {
        const modal = document.getElementById("confirm-delete-modal") as HTMLDialogElement;
        if (modal) {
          modal.showModal();
        }
      }}>
        {children}
      </div>
      <dialog id="confirm-delete-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Confirm Deletion</h3>
          <p className="text-lg py-4 text-gray-700">
            Are you sure you want to delete the account of <span className="font-bold text-gray-900">{doctor.name}</span>?
          </p>
          <p className="text-sm text-red-500 mb-4">This action cannot be undone.</p>
          <div className="modal-action">
            <button 
              className="btn btn-outline" 
              onClick={() => {
                const modal = document.getElementById("confirm-delete-modal") as HTMLDialogElement;
                if (modal) {
                  modal.close();
                }
              }}
              disabled={deleting}
            >
              Cancel
            </button>
            <button 
              className="btn btn-error" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

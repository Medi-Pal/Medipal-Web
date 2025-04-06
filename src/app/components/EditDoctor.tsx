"use client";
import { useEffect, useState } from "react";
import ConfirmDelete from "./ConfirmDelete";
import { useParams, useRouter } from "next/navigation";

export default function EditDoctorDetails() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState({
    id: "",
    name: "",
    specialisation: "",
    phoneNumber: "",
    email: "",
    medicalLicense: "",
    isVerified: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    specialisation: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/doctors/${doctorId}`, {
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch doctor details");
        }

        const data = await response.json();
        setDoctor(data);
        setFormData({
          name: data.name,
          specialisation: data.specialisation,
          phoneNumber: data.phoneNumber,
          email: data.email || "",
        });
      } catch (err) {
        setError("Failed to load doctor details");
        console.error("Error loading doctor details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update doctor details');
      }

      const result = await response.json();

      // Update local doctor data with the result
      setDoctor(result);

      // Show success message
      alert('Doctor details updated successfully');

      // Redirect back to doctors list
      router.push('/admin/doctors');
    } catch (error) {
      console.error('Error updating doctor details:', error);
      alert('Failed to update doctor details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerificationToggle = async () => {
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update verification status');
      }

      const result = await response.json();

      // Update the local state
      setDoctor(prev => ({
        ...prev,
        isVerified: result.isVerified
      }));

      alert(`Doctor verification status updated to: ${result.isVerified ? 'verified' : 'unverified'}`);
    } catch (error) {
      console.error('Error toggling verification status:', error);
      alert('Failed to update verification status. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-gray-800">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center text-red-500 p-4 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col gap-3 justify-center p-8 border-2 rounded-3xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-extrabold text-center text-gray-800">
        Doctor Details
      </h2>
      <p className="text-md text-gray-700 text-center">Update the details below</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <InputItem
          field="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <InputItem
          field="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
        <InputItem
          field="Specialisation"
          name="specialisation"
          value={formData.specialisation}
          onChange={handleInputChange}
        />
        <InputItem
          field="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700">Medical License</p>
          <div className="input input-bordered flex items-center gap-2 cursor-not-allowed bg-gray-100 text-gray-700">
            <span>{doctor.medicalLicense}</span>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleVerificationToggle}
            className={`btn w-full ${doctor.isVerified ? 'btn-warning' : 'btn-primary'}`}
            disabled={submitting}
          >
            {doctor.isVerified ? 'Revoke Verification' : 'Approve Verification'}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-accent mt-4 w-full"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Details'}
        </button>
        <ConfirmDelete doctor={doctor}>
          <button type="button" className="btn btn-error w-full">Delete</button>
        </ConfirmDelete>
        <button
          type="button"
          onClick={() => router.push('/admin/doctors')}
          className="btn btn-neutral w-full"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

function InputItem({
  field,
  name,
  value,
  onChange
}: {
  field: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-700">{field}</p>
      <input
        type="text"
        name={name}
        className="input input-bordered w-full text-gray-800"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

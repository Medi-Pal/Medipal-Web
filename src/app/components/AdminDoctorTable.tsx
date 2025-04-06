"use client";
import { Key, useState } from "react";
import { Doctor } from "../../../utils/types";
import Link from "next/link";

export interface TableItemProps {
    doctor: Doctor;
    key: Key;
    onVerificationToggle: (doctorId: string, currentStatus: boolean) => Promise<void>;
    isUpdating: boolean;
}

export default function ({ doctors }: { doctors: Doctor[] }) {
    const [localDoctors, setLocalDoctors] = useState<Doctor[]>(doctors);
    const [updatingDoctors, setUpdatingDoctors] = useState<Record<string, boolean>>({});
    const [refreshing, setRefreshing] = useState(false);

    // Function to refresh the doctor list
    const refreshDoctorList = async () => {
        setRefreshing(true);
        try {
            const response = await fetch('/api/admin/doctors', {
                cache: 'no-store',
                headers: {
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to refresh doctor list');
            }

            const data = await response.json();
            setLocalDoctors(data);
        } catch (error) {
            console.error('Error refreshing doctor list:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleVerificationToggle = async (doctorId: string, currentStatus: boolean) => {
        try {
            setUpdatingDoctors(prev => ({ ...prev, [doctorId]: true }));

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

            // Update the local state instead of reloading the page
            setLocalDoctors(prev =>
                prev.map(doctor =>
                    doctor.id === doctorId
                        ? { ...doctor, isVerified: result.isVerified }
                        : doctor
                )
            );

            console.log(`Doctor verification status updated to: ${result.isVerified ? 'verified' : 'unverified'}`);
        } catch (error) {
            console.error('Error toggling verification status:', error);
            alert('Failed to update verification status. Please try again.');
        } finally {
            setUpdatingDoctors(prev => ({ ...prev, [doctorId]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Doctor Records</h2>
                    <button
                        onClick={refreshDoctorList}
                        className="btn btn-primary"
                        disabled={refreshing}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh List'}
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-blue-600">
                                <th className="text-base font-semibold text-white p-4">Name</th>
                                <th className="text-base font-semibold text-white p-4">Specialisation</th>
                                <th className="text-base font-semibold text-white p-4">Phone Number</th>
                                <th className="text-base font-semibold text-white p-4">License</th>
                                <th className="text-base font-semibold text-white p-4">Status</th>
                                <th className="text-base font-semibold text-white p-4">Verification</th>
                                <th className="text-base font-semibold text-white p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localDoctors.map((doctor) => {
                                return (
                                    <TableItem
                                        doctor={doctor}
                                        key={`${doctor.medicalLicense}`}
                                        onVerificationToggle={handleVerificationToggle}
                                        isUpdating={!!updatingDoctors[doctor.id]}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function TableItem({ doctor, onVerificationToggle, isUpdating }: TableItemProps) {
    const handleToggle = async () => {
        if (!isUpdating) {
            await onVerificationToggle(doctor.id, doctor.isVerified);
        }
    };

    const [showLicenseModal, setShowLicenseModal] = useState(false);

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="text-base font-medium text-gray-900 p-4">{doctor.name}</td>
            <td className="text-base text-gray-900 p-4">{doctor.specialisation}</td>
            <td className="text-base text-gray-900 p-4">{doctor.phoneNumber}</td>
            <td className="text-base text-gray-900 p-4">
                {doctor.licenseImageUrl ? (
                    <>
                        <button 
                            onClick={() => setShowLicenseModal(true)}
                            className="btn btn-sm btn-info"
                        >
                            View License
                        </button>
                        
                        {/* License Modal */}
                        {showLicenseModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h3 className="text-xl font-semibold">Medical License</h3>
                                        <button 
                                            onClick={() => setShowLicenseModal(false)}
                                            className="btn btn-sm btn-circle"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="p-4 overflow-auto flex-1">
                                        <img 
                                            src={doctor.licenseImageUrl} 
                                            alt="Medical License" 
                                            className="max-w-full h-auto mx-auto"
                                        />
                                    </div>
                                    <div className="p-4 border-t flex justify-between">
                                        <a 
                                            href={doctor.licenseImageUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                        >
                                            Open in New Tab
                                        </a>
                                        <button 
                                            onClick={() => setShowLicenseModal(false)}
                                            className="btn btn-outline"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <span className="text-red-500">No license uploaded</span>
                )}
            </td>
            <td className="text-base text-gray-900 p-4">
                <span className={`px-2 py-1 rounded-full text-sm ${doctor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {doctor.isVerified ? 'Verified' : 'Pending'}
                </span>
            </td>
            <td className="text-base text-gray-900 p-4">
                <button
                    onClick={handleToggle}
                    disabled={isUpdating}
                    className={`btn ${doctor.isVerified ? 'btn-error' : 'btn-success'} btn-sm`}
                >
                    {isUpdating ? 'Updating...' : doctor.isVerified ? 'Revoke' : 'Approve'}
                </button>
            </td>
            <td className="p-4">
                <Link href={`/admin/doctors/${doctor.id}`}>
                    <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-none btn-sm">
                        Update
                    </button>
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
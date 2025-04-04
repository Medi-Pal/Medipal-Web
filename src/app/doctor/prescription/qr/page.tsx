"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a standard font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv.ttf' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 10
  },
  heading: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 3
  },
  medicineItem: {
    marginBottom: 10,
    paddingLeft: 10
  }
});

interface PrescriptionDetails {
  id: string;
  createdOn: string;
  doctor_regNo: {
    Name: string;
    Registration_No: string;
    Specialisation: string;
  };
  patient_contact: {
    Name: string;
    PhoneNumber: string;
  };
  medicine_list: Array<{
    medicine: {
      brandName: string;
      drugName: string;
    };
    dosageType: string;
    dosage: number;
    duration: number | null;
    instruction: string | null;
    times: Array<{
      timeOfDay: string;
      dosage: number;
    }>;
  }>;
}

const PrescriptionDocument = ({ prescription }: { prescription: PrescriptionDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Medical Prescription</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Doctor Details</Text>
        <Text style={styles.text}>Name: {prescription.doctor_regNo.Name}</Text>
        <Text style={styles.text}>License No: {prescription.doctor_regNo.Registration_No}</Text>
        <Text style={styles.text}>Specialisation: {prescription.doctor_regNo.Specialisation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Patient Details</Text>
        <Text style={styles.text}>Name: {prescription.patient_contact.Name}</Text>
        <Text style={styles.text}>Phone: {prescription.patient_contact.PhoneNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Medicines</Text>
        {prescription.medicine_list.map((med, index) => (
          <View key={index} style={styles.medicineItem}>
            <Text style={styles.text}>
              {med.medicine.brandName} ({med.medicine.drugName})
            </Text>
            <Text style={styles.text}>
              Dosage: {med.dosage} {med.dosageType}
            </Text>
            <Text style={styles.text}>
              Timing: {med.times.map(t => `${t.timeOfDay} (${t.dosage})`).join(', ')}
            </Text>
            {med.duration && (
              <Text style={styles.text}>Duration: {med.duration} doses</Text>
            )}
            {med.instruction && (
              <Text style={styles.text}>Instructions: {med.instruction}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Date: {new Date(prescription.createdOn).toLocaleDateString()}</Text>
        <Text style={styles.text}>Prescription ID: {prescription.id}</Text>
      </View>
    </Page>
  </Document>
);

export default function PrescriptionQRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prescriptionId = searchParams.get('id');
  const [prescription, setPrescription] = useState<PrescriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prescriptionId) {
      setError('No prescription ID provided');
      setLoading(false);
      return;
    }

    fetch(`/api/prescription/${prescriptionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setPrescription(data);
      })
      .catch(err => {
        console.error('Failed to fetch prescription:', err);
        setError('Failed to load prescription details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [prescriptionId]);

  const handleEdit = () => {
    if (!prescription) return;
    router.push(`/doctor/prescription/edit/${prescription.id}`);
  };

  const handleReuse = async () => {
    if (!prescription) return;
    setLoading(true);

    try {
      const response = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicines: prescription.medicine_list.map(med => ({
            medicineId: med.medicine.Serial_No,
            dosageType: med.dosageType,
            duration: med.duration,
            instruction: med.instruction,
            times: med.times
          })),
          patientContact: "",
          patientDetails: {
            name: "",
            age: null,
            city: null,
            state: "",
            country: "",
            diagnosis: ""
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      router.push(`/doctor/prescription?id=${data.id}&reuse=true`);
    } catch (err) {
      console.error('Failed to reuse prescription:', err);
      setError('Failed to create new prescription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="alert alert-error">
        <span>{error || 'Failed to load prescription'}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Prescription Details</h1>
          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              className="btn btn-primary"
              disabled={loading}
            >
              Edit Prescription
            </button>
            <button
              onClick={handleReuse}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reuse Prescription
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Doctor Information</h2>
            <p className="text-gray-700">Name: {prescription.doctor_regNo.Name}</p>
            <p className="text-gray-700">License No: {prescription.doctor_regNo.Registration_No}</p>
            <p className="text-gray-700">Specialisation: {prescription.doctor_regNo.Specialisation}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
            <p className="text-gray-700">Name: {prescription.patient_contact.Name}</p>
            <p className="text-gray-700">Phone: {prescription.patient_contact.PhoneNumber}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Medicines</h2>
          <div className="space-y-4">
            {prescription.medicine_list.map((med, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="font-medium text-gray-800">{med.medicine.brandName} ({med.medicine.drugName})</p>
                <p className="text-gray-700">Dosage: {med.dosage} {med.dosageType}</p>
                <p className="text-gray-700">Timing: {med.times.map(t => `${t.timeOfDay} (${t.dosage})`).join(', ')}</p>
                {med.duration && <p className="text-gray-700">Duration: {med.duration} doses</p>}
                {med.instruction && <p className="text-gray-700">Instructions: {med.instruction}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center p-4">
          <QRCode
            value={prescription.id}
            size={200}
            level="H"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Created on: {new Date(prescription.createdOn).toLocaleDateString()}
          </p>
          <PDFDownloadLink
            document={<PrescriptionDocument prescription={prescription} />}
            fileName={`prescription-${prescription.id}.pdf`}
            className="btn btn-primary"
          >
            {({ loading }) => loading ? 'Generating PDF...' : 'Download PDF'}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}

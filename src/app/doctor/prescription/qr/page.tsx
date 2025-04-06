"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image, Svg, Path } from '@react-pdf/renderer';

// Register a standard font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv.ttf' }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    backgroundColor: 'white',
  },
  doctorHeader: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  doctorRegNo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  headerRight: {
    position: 'absolute',
    top: 40,
    right: 40,
    fontSize: 14,
    paddingBottom: 10,
  },
  patientInfo: {
    marginTop: 40,
  },
  patientDetail: {
    fontSize: 14,
    marginBottom: 8,
  },
  contactInfo: {
    position: 'absolute',
    top: 190,
    right: 40,
    fontSize: 14,
    textAlign: 'right',
  },
  rxSymbol: {
    fontSize: 60,
    color: '#0066FF',
    marginTop: 30,
    marginLeft: 40,
  },
  dosageNote: {
    marginLeft: 220,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  medicineTable: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  medicineName: {
    width: '40%',
  },
  dosage: {
    width: '40%',
  },
  total: {
    width: '20%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 15,
    fontSize: 14,
  },
  instructions: {
    fontSize: 12,
    marginLeft: 150,
    fontStyle: 'italic',
    marginBottom: 15,
    color: '#555',
  },
  signature: {
    position: 'absolute',
    bottom: 60,
    right: 40,
    textAlign: 'center',
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  },
});

interface PrescriptionDetails {
  id: string;
  createdOn: string;
  diagnosis?: string;
  doctor_regNo: {
    Name: string;
    Registration_No: string;
    Specialisation: string;
  };
  patient_contact: {
    Name: string;
    PhoneNumber: string;
    Age?: number;
    Gender?: string;
  };
  medicine_list: Array<{
    medicine: {
      brandName: string;
      drugName: string;
      Serial_No: number;
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

// Helper function to format dosage pattern like "0-1-0-0"
const formatDosagePattern = (times: Array<{timeOfDay: string, dosage: number}>) => {
  const pattern = [0, 0, 0, 0]; // morning-afternoon-evening-night
  
  times.forEach(time => {
    switch(time.timeOfDay.toLowerCase()) {
      case 'morning':
        pattern[0] = time.dosage;
        break;
      case 'afternoon':
        pattern[1] = time.dosage;
        break;
      case 'evening':
        pattern[2] = time.dosage;
        break;
      case 'night':
        pattern[3] = time.dosage;
        break;
    }
  });
  
  return pattern.join('-');
};

const calculateTotalDosage = (pattern: string, duration: number | null) => {
  if (!duration) return 0;
  
  const doses = pattern.split('-').map(Number);
  const dailyDoses = doses.reduce((sum, dose) => sum + dose, 0);
  return dailyDoses * duration;
};

const PrescriptionDocument = ({ prescription, diagnosisText }: { prescription: PrescriptionDetails, diagnosisText: string }) => {
  // Format the date as DD-MM-YY
  const formattedDate = new Date(prescription.createdOn).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '-');
  
  // Extract patient gender and age (if available)
  const patientAge = prescription.patient_contact.Age ? `${prescription.patient_contact.Age} yrs` : '';
  const patientGender = prescription.patient_contact.Gender ? prescription.patient_contact.Gender.toLowerCase() : 'male';
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Doctor's name and registration */}
        <Text style={styles.doctorHeader}>Dr. {prescription.doctor_regNo.Name}</Text>
        <Text style={styles.doctorRegNo}>Reg. no.{prescription.doctor_regNo.Registration_No}</Text>
        
        {/* Header with date and contact info only (removed prescription ID) */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
          <View style={{ textAlign: 'right' }}>
            <Text>Date: {formattedDate}</Text>
            <Text>Contact no: {prescription.patient_contact.PhoneNumber}</Text>
          </View>
        </View>
        
        {/* Patient information */}
        <View style={styles.patientInfo}>
          <Text style={styles.patientDetail}>Patient name: {prescription.patient_contact.Name}</Text>
          <Text style={styles.patientDetail}>Age: {patientAge}</Text>
          <Text style={styles.patientDetail}>Sex: {patientGender}</Text>
          <Text style={styles.patientDetail}>Diagnosis: {diagnosisText || 'None'}</Text>
        </View>
        
        {/* Rx symbol */}
        <Text style={styles.rxSymbol}>Rx</Text>
        
        {/* Dosage reference */}
        <Text style={styles.dosageNote}>The dosage refers to morning-afternoon-evening-night</Text>
        
        {/* Medicine table */}
        <View style={styles.medicineTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.medicineName}>Medicine name</Text>
            <Text style={styles.dosage}>dosage</Text>
            <Text style={styles.total}>total</Text>
          </View>
          
          {prescription.medicine_list.map((med, index) => {
            const dosagePattern = formatDosagePattern(med.times);
            const totalDoses = calculateTotalDosage(dosagePattern, med.duration);
            
            return (
              <View key={index}>
                <View style={styles.tableRow}>
                  <Text style={styles.medicineName}>{med.medicine.brandName}</Text>
                  <Text style={styles.dosage}>{dosagePattern}</Text>
                  <Text style={styles.total}>{med.duration || 9}</Text>
                </View>
                {med.instruction && (
                  <Text style={styles.instructions}>Instructions: {med.instruction}</Text>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Footer with signature and prescription ID */}
        <View style={{ position: 'absolute', bottom: 60, width: '100%' }}>
          {/* Prescription ID on left */}
          <Text style={{ position: 'absolute', left: 40, bottom: 0, fontSize: 12 }}>
            Prescription id: {prescription.id}
          </Text>
          
          {/* Signature on right */}
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text>Digitally signed by</Text>
            <Text>Doctor's name</Text>
            <Text>({prescription.doctor_regNo.Specialisation})</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function PrescriptionQRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prescriptionId = searchParams.get('id');
  const [prescription, setPrescription] = useState<PrescriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState<string>("");

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
        console.log("Prescription data:", JSON.stringify(data, null, 2));
        console.log("Has diagnosis field:", 'diagnosis' in data);
        console.log("Diagnosis value:", data.diagnosis);
        setPrescription(data);
        setDiagnosis(data.diagnosis || "-");
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
    console.log("Starting reuse with prescription:", prescription.id);

    try {
      // Simplify the payload to just the essential medicine information
      const simplifiedMedicines = prescription.medicine_list.map(med => ({
        medicineId: med.medicine.Serial_No,
        dosageType: med.dosageType,
        dosage: med.dosage,
        duration: med.duration,
        instruction: med.instruction,
        times: med.times.map(t => ({
          timeOfDay: t.timeOfDay,
          dosage: t.dosage
        }))
      }));

      console.log("Simplified medicines:", simplifiedMedicines);

      // Create a temporary phone number for patient contact (required by API)
      const tempPhoneNumber = "temp_" + Date.now();
      
      const response = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicines: simplifiedMedicines,
          // Use a temporary phone number instead of empty string
          patientContact: tempPhoneNumber,
          patientDetails: {
            name: "Temporary Patient",
            age: null,
            city: "",
            state: "",
            country: "",
            diagnosis: ""
          }
        })
      });

      const responseText = await response.text();
      console.log("API Response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || `Failed with status: ${response.status}`);
      }

      // On success, navigate to the new prescription
      const newUrl = `/doctor/prescription?id=${data.id}&reuse=true`;
      console.log("Navigating to:", newUrl);
      
      window.location.href = newUrl; // Use direct navigation to avoid router issues
    } catch (err) {
      console.error('Failed to reuse prescription:', err);
      setError(err instanceof Error ? err.message : 'Failed to create new prescription');
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
            <p className="text-gray-700">Diagnosis: {prescription.diagnosis || diagnosis || 'None'}</p>
            {/* Debug information - remove hidden class to see */}
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded hidden">
              {JSON.stringify({
                prescriptionDiagnosis: prescription.diagnosis,
                localDiagnosis: diagnosis,
                hasField: 'diagnosis' in prescription
              }, null, 2)}
            </pre>
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
            document={(() => {
              console.log("Creating PDF with diagnosis:", prescription.diagnosis || diagnosis);
              return <PrescriptionDocument
                prescription={prescription}
                diagnosisText={prescription.diagnosis || diagnosis}
              />;
            })()}
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

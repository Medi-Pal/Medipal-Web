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
    padding: 0,
    backgroundColor: 'white',
  },
  headerSection: {
    backgroundColor: '#102654', // Navy blue background
    paddingVertical: 20,
    paddingHorizontal: 40,
    color: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  headerText: {
    marginLeft: 10,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  doctorName: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  topWave: {
    height: 40,
  },
  bottomWave: {
    height: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentSection: {
    padding: 40,
    flex: 1,
  },
  patientInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 20,
  },
  patientInfoColumn: {
    width: '48%',
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  infoLine: {
    fontSize: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
  },
  medicineSection: {
    flex: 1,
    marginBottom: 20,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.05,
    width: 200,
    height: 200,
  },
  footerSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  hospitalInfo: {
    fontSize: 10,
    color: '#333',
  },
  signatureSection: {
    marginRight: 40,
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
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

const PrescriptionDocument = ({ prescription, diagnosisText }: { prescription: PrescriptionDetails, diagnosisText: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Medical symbol watermark */}
      <View style={styles.watermark}>
        <Svg width={200} height={200} viewBox="0 0 24 24">
          <Path
            d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3zm0 4c1.1 0 2 1.3 2 3s-.9 3-2 3-2-1.3-2-3 .9-3 2-3z"
            fill="#f0f0f0"
          />
        </Svg>
      </View>

      {/* Header with curved design */}
      <View style={styles.headerSection}>
        {/* Medical symbol */}
        <Svg width={30} height={30} viewBox="0 0 24 24">
          <Path
            d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3zm0 4c1.1 0 2 1.3 2 3s-.9 3-2 3-2-1.3-2-3 .9-3 2-3z"
            fill="white"
          />
        </Svg>

        <View style={styles.headerText}>
          <Text style={styles.prescriptionTitle}>PRESCRIPTION</Text>
          <Text style={styles.doctorName}>Dr. {prescription.doctor_regNo.Name}</Text>
          <Text style={styles.doctorSpecialty}>{prescription.doctor_regNo.Specialisation} Doctor</Text>
        </View>

        {/* RX Logo at top right */}
        <View style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }}>
          <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>Rx</Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        {/* Patient details section */}
        <View style={styles.patientInfoSection}>
          <View style={styles.patientInfoColumn}>
            <Text style={styles.label}>Patient Name</Text>
            <Text style={styles.infoLine}>{prescription.patient_contact.Name}</Text>

            <Text style={styles.label}>Date</Text>
            <Text style={styles.infoLine}>{new Date(prescription.createdOn).toLocaleDateString()}</Text>
          </View>

          <View style={styles.patientInfoColumn}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.infoLine}>{prescription.patient_contact.PhoneNumber}</Text>

            <Text style={styles.label}>Diagnosis</Text>
            <Text style={styles.infoLine}>
              {/* Try multiple fallbacks for diagnosis */}
              {prescription.diagnosis ? prescription.diagnosis :
                diagnosisText && diagnosisText !== '-' ? diagnosisText : 'None'}
            </Text>
          </View>
        </View>

        {/* Medicine list */}
        <View style={styles.medicineSection}>
          {prescription.medicine_list.map((med, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 12, marginBottom: 3 }}>
                • {med.medicine.brandName} ({med.medicine.drugName})
              </Text>
              <Text style={{ fontSize: 10, marginLeft: 10, marginBottom: 2 }}>
                Dosage: {med.dosage} {med.dosageType}
              </Text>
              <Text style={{ fontSize: 10, marginLeft: 10, marginBottom: 2 }}>
                Timing: {med.times.map(t => `${t.timeOfDay} (${t.dosage})`).join(', ')}
              </Text>
              {med.duration && (
                <Text style={{ fontSize: 10, marginLeft: 10, marginBottom: 2 }}>
                  Duration: {med.duration} days
                </Text>
              )}
              {med.instruction && (
                <Text style={{ fontSize: 10, marginLeft: 10, marginBottom: 2 }}>
                  Instructions: {med.instruction}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Footer with signature */}
      <View style={styles.footerSection}>
        <View style={{ width: '40%' }}></View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Signature</Text>
          <Text style={{ fontSize: 10, marginTop: 5, color: '#444' }}>
            Digitally signed by
          </Text>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#333' }}>
            Dr. {prescription.doctor_regNo.Name}
          </Text>
        </View>
      </View>

      {/* Bottom wave design */}
      <View style={styles.bottomWave}>
        <Svg viewBox="0 0 1440 320" height="100%" width="100%">
          <Path
            d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,176C672,160,768,160,864,176C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#F7931E" // Orange curve
          />
          <Path
            d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,160C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#1E90FF" // Blue curve
          />
        </Svg>
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

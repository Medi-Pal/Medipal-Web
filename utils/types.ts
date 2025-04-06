export interface Doctor {
  id: string;
  name: string;
  specialisation: string;
  phoneNumber: string;
  medicalLicense: string;
  isVerified: boolean;
}

export interface PatientDetails {
  id: string;
  name: string;
  phoneNumber: string;
  age?: number;
  city?: string;
}

export interface Prescription {
  id: string;
  createdOn: Date;
  doctorId: string;
  patientId: string;
  medicines: Medicine[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: number;
  date: string;
  diagnosis: string;
  address: string;
}

export interface Medicine {
  id: number;
  brandName: string;
  type?: string;
  drugName: string;
  description?: string;
}

export interface Frequency {
  morning: number;
  afternoon: number;
  night: number;
  other?: string | null;
}

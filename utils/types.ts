export interface Doctor{
    id: string,
    name: string,
    specialisation: string,
    phoneNumber: Number,
    medicalLicense: string,
    status: Boolean
}

export interface PatientDetails{
  id: string,
  name: string,
  phoneNumber: number
}

export interface Prescription {
  id: string,
  patient: Patient;
  medicine: Medicine[];
  doctor: Doctor;
}

  export interface Patient {
    id: string,
    name: string;
    age: number;
    gender: string;
    contact: number;
    date: string;
    diagnosis: string;
    address: string;
  }
  export interface Medicine {
    name: string;
    dosageType: string;
    frequency: Frequency;
    duration: number;
  }
  export interface Frequency {
    morning: number;
    afternoon: number;
    night: number;
    other?: string | null;
  }
  
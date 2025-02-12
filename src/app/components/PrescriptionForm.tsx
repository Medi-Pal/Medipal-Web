"use client";

import { randomUUID } from "crypto";
import { useState } from "react";

export default function () {
  const [medicines, setMedicines] = useState([{}]);

  function addMedicine() {
    setMedicines((prev) => {
      prev = [...prev, {}];
      return prev;
    });
  }

  return (
    <div className="flex flex-col py-10 justify-center items-center gap-8">
      <h1 className="text text-2xl text-center">Medical Prescription Form</h1>

      {/* <!-- Patient Information Section --> */}
      <section className="flex flex-col justify-center gap-4 p-4">
        <h2 className="text-center text-xl">Patient Information</h2>
        <label htmlFor="patient-name">Name:</label>
        <input
          className="input input-bordered"
          type="text"
          id="patient-name"
          name="patient-name"
          required
        />

        <label htmlFor="patient-age">Age:</label>
        <input
          className="input input-bordered"
          type="number"
          id="patient-age"
          name="patient-age"
          required
        />

        <label htmlFor="patient-gender">Gender:</label>
        <select
          className="select select-bordered"
          id="patient-gender"
          name="patient-gender"
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="patient-contact">Contact Number:</label>
        <input
          className="input input-bordered"
          type="tel"
          id="patient-contact"
          name="patient-contact"
          required
        />
        <label htmlFor="date">Date:</label>
        <input
          className="input input-bordered"
          type="date"
          name="date"
          id="date"
          required
        />

        <label htmlFor="diagnosis">Diagnosis:</label>
        <input
          className="input input-bordered"
          type="text"
          id="diagnosis"
          name="diagnosis"
        />
      </section>

      {/* <!-- Prescription Details Section --> */}

      <section className="flex flex-col justify-center gap-12 border-4 rounded-3xl p-12">
        <h2 className="text text-xl text-center">Prescription Details:</h2>
        {medicines.map((medicine, index) => {
          return <MedicineItem key={index} medicine={medicine} />;
        })}
        <button
          type="button"
          className="btn btn-primary"
          id="add-medication"
          onClick={addMedicine}
        >
          + Add Medication
        </button>
      </section>

      {/* <!-- Doctor's Information Section --> */}
      <section className="flex flex-col gap-4">
        <h2 className="text text-xl text-center">Doctor's Information</h2>
        <label htmlFor="doctor-name">Name:</label>
        <input
          className="input input-bordered"
          type="text"
          id="doctor-name"
          name="doctor-name"
          required
        />

        <label htmlFor="doctor-contact">Contact Number:</label>
        <input
          className="input input-bordered"
          type="tel"
          id="doctor-contact"
          name="doctor-contact"
          required
        />
      </section>

      <button className="btn btn-success" type="submit">
        Submit Prescription
      </button>
    </div>
  );
}

function MedicineItem({ medicine }: { medicine: any }) {
  return (
    <div className="flex flex-col justify-center gap-4 border-2 p-8">
      <label htmlFor="medicine">Medicine:</label>
      <input
        className="input input-bordered"
        list="medicines"
        name="medicine"
        id="medicine"
      />
      <datalist id="medicines">
        <option value="Crocin 650" />
        <option value="Dolo" />
        <option value="Sinarest" />
        <option value="Chericough" />
        <option value="Benadryl" />
      </datalist>

      <label htmlFor="dosage">Dosage:</label>
      <input className="input input-bordered" type="text" name="dosage[]" />

      <label htmlFor="frequency">Frequency:</label>
      <input className="input input-bordered" type="text" name="frequency[]" />

      <label htmlFor="duration">Duration:</label>
      <input className="input input-bordered" type="text" name="duration[]" />
    </div>
  );
}

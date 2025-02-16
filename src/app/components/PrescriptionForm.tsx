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

  function isLastMedicine() {
    return medicines.length == 1;
  }

  return (
    <div className="flex flex-col items-center bg-blue-200">
      <div className="flex flex-col py-2 m-0 max-w-max glass">
        <h1 className="text text-2xl text-center">Medical Prescription Form</h1>

        {/* <!-- Patient Information Section --> */}
        <section className="flex flex-col justify-center gap-2 p-4">
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

        <section className="flex flex-col justify-center p-4 border-y-8">
          <h2 className="text text-xl text-center">Prescription Details:</h2>
          {medicines.map((medicine, index) => {
            return (
              <MedicineItem
                isLast={isLastMedicine()}
                key={index}
                medicine={medicine}
              />
            );
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
        <section className="flex flex-col justify-center gap-2 p-4">
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

        <section className="flex flex-col p-4 gap-4">
          <p className="text text-xl text-center">Additional Notes:</p>
          <textarea
            className="textarea textarea-bordered"
            name="other"
            id="other"
          ></textarea>
        </section>

        <button className="btn btn-success" type="submit">
          Submit Prescription
        </button>
      </div>
    </div>
  );
}

function MedicineItem({
  medicine,
  isLast,
}: {
  medicine: any;
  isLast: Boolean;
}) {
  const [other, setOther] = useState(false);

  function handleSetOther() {
    setOther((prev) => !prev);
  }

  return (
    <div className="flex flex-col justify-center p-8 gap-1">
      <label className="label text-lg" htmlFor="medicine">
        Medicine:
      </label>
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

      <div>
        <label htmlFor="dosage" className="label text-lg">
          Unit:
        </label>
        <div className="menu menu-horizontal">
          <input className="input input-bordered" type="text" name="dosage[]" />
          <select className="select select-bordered" name="unit" id="unit">
            <option value="ml">ml</option>
            <option value="drop">drop</option>
            <option value="tablet">tablet</option>
          </select>
        </div>
      </div>

      <p className="label text-lg">Frequency:</p>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text text-base">Morning</span>
          <input type="checkbox" className="checkbox" />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text text-base">Afternoon</span>
          <input type="checkbox" className="checkbox" />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text text-base">Night</span>
          <input type="checkbox" className="checkbox" />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text text-base">Other:</span>
          <input
            type="checkbox"
            onChange={handleSetOther}
            className="checkbox"
          />
        </label>
      </div>
      {other ? (
        <textarea
          className="textarea textarea-bordered"
          name="other"
          id="other"
        ></textarea>
      ) : (
        <></>
      )}
      <label htmlFor="duration" className="label text-lg">
        Dosage:
      </label>
      <input className="input input-bordered" type="text" name="duration[]" />
      {isLast ? <></> : <button className="btn btn-error">Remove</button>}
    </div>
  );
}

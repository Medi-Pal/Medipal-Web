import PrescriptionDetails from "@/app/components/PrescriptionDetails";
import QrCode from "@/app/components/QrCode";

export default function () {
  return (
    <div className="flex flex-col justify-between gap-10 items-center p-4">
      <h2 className="text text-3xl font-bold">Prescription Details</h2>

      <div className="flex flex-col gap-10 justify-between items-center">
        <PrescriptionDetails />
        <QrCode />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <button className="btn btn-primary">Dowload Prescription</button>
        <button className="btn btn-secondary">Edit Prescription</button>
        <button className="btn btn-accent">Reuse Prescription</button>
      </div>
    </div>
  );
}

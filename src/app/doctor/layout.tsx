import DoctorNavbar from "../components/DoctorNavbar";

export default function ({ children }: { children: React.ReactNode }) {
  return <DoctorNavbar title={"Doctor Gaurish"} children={children} />;
}

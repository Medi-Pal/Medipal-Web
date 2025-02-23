"use client";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function QrCode() {
  const [qrCodeValue, setQrCodeValue] = useState("lol");
  return <QRCode value={qrCodeValue} />;
}

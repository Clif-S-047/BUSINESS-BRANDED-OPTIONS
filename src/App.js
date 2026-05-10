

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import logo from "./logo.png";

export default function App() {
  // Customer Info
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Services
  const [ethernet, setEthernet] = useState(0);
  const [tvMounts, setTvMounts] = useState(0);
  const [cameras, setCameras] = useState(0);
  const [smartDevices, setSmartDevices] = useState(0);
  const [lightingZones, setLightingZones] = useState(0);
  const [networkSetup, setNetworkSetup] = useState(false);

  // Pricing
  const [margin, setMargin] = useState(40);
  const [paid, setPaid] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState([]);

  const basePrices = {
    ethernet: 120,
    tvMount: 150,
    camera: 150,
    smartDevice: 100,
    lightingZone: 200,
    networkSetup: 250,
  };

  const applyMargin = (price) => price * (1 + margin / 100);

  // Individual prices
  const ethernetPrice = applyMargin(basePrices.ethernet);
  const tvPrice = applyMargin(basePrices.tvMount);
  const cameraPrice = applyMargin(basePrices.camera);
  const smartPrice = applyMargin(basePrices.smartDevice);
  const lightingPrice = applyMargin(basePrices.lightingZone);
  const networkPrice = applyMargin(basePrices.networkSetup);

  // Total
  const total =
    ethernet * ethernetPrice +
    tvMounts * tvPrice +
    cameras * cameraPrice +
    smartDevices * smartPrice +
    lightingZones * lightingPrice +
    (networkSetup ? networkPrice : 0);

  // Tax (7%)
  const taxRate = 0.07;
  const subtotal = Math.round(total);
  const taxAmount = Math.round(subtotal * taxRate);
  const finalTotal = subtotal + taxAmount;

  // Invoice #
  const invoiceNumber = "INV-" + Date.now();

  useEffect(() => {
    const stored = localStorage.getItem("quotes");
    if (stored) setSavedQuotes(JSON.parse(stored));
  }, []);

  const saveQuote = () => {
    const newQuote = {
      customerName,
      total: finalTotal,
      date: new Date().toLocaleDateString(),
    };

    const updated = [...savedQuotes, newQuote];
    setSavedQuotes(updated);
    localStorage.setItem("quotes", JSON.stringify(updated));
  };

  // ✅ PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 15;

    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 150, 10, 40, 20);

    doc.setFontSize(18);
    doc.text("Tiger Tech Consulting", 10, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Veteran-Owned Technology Services", 10, y += 5);
    doc.text("Virginia Beach, VA", 10, y += 5);
    doc.text(`Invoice #: ${invoiceNumber}`, 10, y += 5);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y += 10);

    doc.text(`Customer: ${customerName}`, 10, y += 5);
    doc.text(`Phone: ${phone}`, 10, y += 5);
    doc.text(`Email: ${email}`, 10, y += 10);

    doc.line(10, y, 200, y);
    y += 8;

    // Table header
    doc.text("Service", 10, y);
    doc.text("Qty", 100, y);
    doc.text("Total", 160, y);
    y += 5;

    doc.line(10, y, 200, y);
    y += 5;

    const row = (name, qty, price) => {
      doc.text(name, 10, y);
      doc.text(String(qty), 100, y);
      doc.text(`$${Math.round(qty * price)}`, 160, y);
      y += 6;
    };

    if (ethernet > 0) row("Ethernet", ethernet, ethernetPrice);
    if (tvMounts > 0) row("TV Mounts", tvMounts, tvPrice);
    if (cameras > 0) row("Cameras", cameras, cameraPrice);
    if (smartDevices > 0) row("Smart Devices", smartDevices, smartPrice);
    if (lightingZones > 0) row("Lighting Zones", lightingZones, lightingPrice);
    if (networkSetup) {
      doc.text("Network Setup", 10, y);
      doc.text("-", 100, y);
      doc.text(`$${Math.round(networkPrice)}`, 160, y);
      y += 6;
    }

    y += 5;
    doc.line(120, y, 200, y);
    y += 6;

    doc.text(`Subtotal: $${subtotal}`, 130, y += 5);
    doc.text(`Tax: $${taxAmount}`, 130, y += 5);

    doc.setFontSize(14);
    doc.text(`TOTAL: $${finalTotal}`, 130, y += 6);

    y += 10;
    doc.setFontSize(10);
    doc.text(`Status: ${paid ? "PAID" : "UNPAID"}`, 10, y);

    y += 10;
    doc.text("[ ] Customer Approves Estimate", 10, y);

    y += 10;
    doc.line(10, y, 80, y);
    doc.text("Customer Signature", 10, y + 5);

    doc.line(120, y, 200, y);
    doc.text("Company Signature", 120, y + 5);

    doc.save("Invoice.pdf");
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "auto" }}>

      <img src={logo} width={120} alt="logo" />
      <h2>Tiger Tech Consulting</h2>

      <h3>Customer Info</h3>
      <input placeholder="Name" onChange={(e) => setCustomerName(e.target.value)} /><br />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />
      <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} /><br />
      <input placeholder="Notes" onChange={(e) => setNotes(e.target.value)} /><br />

      <h3>Services</h3>
      <input type="number" placeholder="Ethernet" onChange={(e) => setEthernet(Number(e.target.value))} /><br />
      <input type="number" placeholder="TV Mounts" onChange={(e) => setTvMounts(Number(e.target.value))} /><br />
      <input type="number" placeholder="Cameras" onChange={(e) => setCameras(Number(e.target.value))} /><br />
      <input type="number" placeholder="Smart Devices" onChange={(e) => setSmartDevices(Number(e.target.value))} /><br />
      <input type="number" placeholder="Lighting Zones" onChange={(e) => setLightingZones(Number(e.target.value))} /><br />

      <label>
        <input type="checkbox" onChange={() => setNetworkSetup(!networkSetup)} />
        Network Setup
      </label>

      <h3>Pricing Tier</h3>
      <button onClick={() => setMargin(25)}>Basic</button>
      <button onClick={() => setMargin(40)}>Standard</button>
      <button onClick={() => setMargin(60)}>Premium</button>

      <h2>Subtotal: ${subtotal}</h2>
      <h3>Tax: ${taxAmount}</h3>
      <h2>Total: ${finalTotal}</h2>

      <button onClick={() => setPaid(!paid)}>
        Mark as {paid ? "Unpaid" : "Paid"}
      </button>

      <br /><br />
      <button onClick={generatePDF}>Download Invoice</button>
      <button onClick={saveQuote}>Save</button>

      <h3>Saved Jobs</h3>
      {savedQuotes.map((q, i) => (
        <div key={i}>
          {q.customerName} - ${q.total}
        </div>
      ))}

    </div>
  );
}

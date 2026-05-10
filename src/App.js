
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import logo from "./logo.png";

export default function App() {
  // Customer info
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

  // Saved quotes
  const [savedQuotes, setSavedQuotes] = useState([]);

  // Base prices
  const basePrices = {
    ethernet: 120,
    tvMount: 150,
    camera: 150,
    smartDevice: 100,
    lightingZone: 200,
    networkSetup: 250,
  };

  // Apply margin
  const applyMargin = (price) => price * (1 + margin / 100);

  // Calculate total
  const total =
    ethernet * applyMargin(basePrices.ethernet) +
    tvMounts * applyMargin(basePrices.tvMount) +
    cameras * applyMargin(basePrices.camera) +
    smartDevices * applyMargin(basePrices.smartDevice) +
    lightingZones * applyMargin(basePrices.lightingZone) +
    (networkSetup ? applyMargin(basePrices.networkSetup) : 0);

  // Load saved quotes on start
  useEffect(() => {
    const stored = localStorage.getItem("quotes");
    if (stored) {
      setSavedQuotes(JSON.parse(stored));
    }
  }, []);

  // Save quote
  const saveQuote = () => {
    const newQuote = {
      customerName,
      email,
      phone,
      total: Math.round(total),
      date: new Date().toLocaleDateString(),
    };

    const updatedQuotes = [...savedQuotes, newQuote];
    setSavedQuotes(updatedQuotes);
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Tiger Tech Consulting", 10, 10);
    doc.text(`Customer: ${customerName}`, 10, 20);
    doc.text(`Phone: ${phone}`, 10, 30);
    doc.text(`Email: ${email}`, 10, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 50);
    doc.text(`Total: $${Math.round(total)}`, 10, 60);
    doc.text(`Notes: ${notes}`, 10, 70);

    doc.save("quote.pdf");
  };

  // Email Quote
  const emailQuote = () => {
    const subject = "Tiger Tech Consulting Quote";

    const body = `
Hello ${customerName},

Thank you for choosing Tiger Tech Consulting.

Here is your quote:

Total: $${Math.round(total)}

We provide professional low-voltage, networking, smart home, and AV services.

Reply to this email to schedule your service.

- Tiger Tech Consulting
`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "auto", fontFamily: "Arial" }}>
      
      {/* LOGO + BRANDING */}
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="logo" style={{ width: 120, marginBottom: 10 }} />
        <h2 style={{ color: "#5A2DA8" }}>Tiger Tech Consulting</h2>
        <p style={{ color: "#D4A017" }}>
          Smart Solutions • Clean Installs • Reliable Results
        </p>
      </div>

      {/* CUSTOMER INFO */}
      <h3>Customer Info</h3>
      <input
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br />

      <input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      /><br />

      {/* PRICING TIERS */}
      <h3>Pricing Tier</h3>
      <button onClick={() => setMargin(25)}>Basic</button>
      <button onClick={() => setMargin(40)}>Standard</button>
      <button onClick={() => setMargin(60)}>Premium</button>

      <p>Margin: {margin}%</p>

      {/* SERVICES */}
      <h3>Services</h3>
      <input
        type="number"
        placeholder="Ethernet Drops"
        value={ethernet}
        onChange={(e) => setEthernet(Number(e.target.value))}
      /><br />

      <input
        type="number"
        placeholder="TV Mounts"
        value={tvMounts}
        onChange={(e) => setTvMounts(Number(e.target.value))}
      /><br />

      <input
        type="number"
        placeholder="Cameras"
        value={cameras}
        onChange={(e) => setCameras(Number(e.target.value))}
      /><br />

      <input
        type="number"
        placeholder="Smart Devices"
        value={smartDevices}
        onChange={(e) => setSmartDevices(Number(e.target.value))}
      /><br />

      <input
        type="number"
        placeholder="Lighting Zones"
        value={lightingZones}
        onChange={(e) => setLightingZones(Number(e.target.value))}
      /><br />

      <label>
        <input
          type="checkbox"
          checked={networkSetup}
          onChange={() => setNetworkSetup(!networkSetup)}
        />
        Network Setup
      </label>

      {/* TOTAL */}
      <h2>Total: ${Math.round(total)}</h2>

      {/* ACTION BUTTONS */}
      <button onClick={generatePDF}>Download PDF</button>
      <button onClick={emailQuote}>Email Quote</button>
      <button onClick={saveQuote}>Save Quote</button>

      {/* SAVED QUOTES DISPLAY */}
      <h3>Saved Quotes</h3>
      {savedQuotes.map((q, i) => (
        <div key={i} style={{ border: "1px solid #ccc", marginTop: 5, padding: 5 }}>
          <strong>{q.customerName}</strong><br />
          ${q.total} – {q.date}
        </div>
      ))}
    </div>
  );
}

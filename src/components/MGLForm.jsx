
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Design tokens ─────────────────────────────────────── */
const C = {
  primary: "#1a6b2e",
  primaryFg: "#ffffff",
  accent: "#d4ed7a",       // lime-yellow (header pill)
  accentDark: "#acd655",
  sectionPill: "#b8dd6e",
  border: "#555",
  borderLight: "#999",
  bg: "#f7f7f3",
  surface: "#ffffff",
  muted: "#f0f0ea",
  text: "#1a1a1a",
  textMuted: "#555",
  red: "#c0392b",
  inputFocus: "#1a6b2e",
};

const font = "'Georgia', serif";
const fontMono = "'Courier New', monospace";

/* ─── Tiny helpers ───────────────────────────────────────── */
const BoxInput = ({ length, value, onChange, uppercase = true, numeric = false, style = {} }) => {
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");
  const refs = useRef([]);

  const handleChange = (i, v) => {
    let ch = v.slice(-1);
    if (numeric && ch && !/[0-9]/.test(ch)) return;
    if (uppercase) ch = ch.toUpperCase();
    const next = (value + " ".repeat(length)).slice(0, length).split("");
    next[i] = ch;
    const joined = next.join("").replace(/\s+$/g, "");
    onChange(joined);
    if (ch && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 2, ...style }}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={c}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          inputMode={numeric ? "numeric" : "text"}
          maxLength={1}
          style={{
            height: 28,
            width: 28,
            border: `1px solid ${C.border}`,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: fontMono,
            textTransform: "uppercase",
            color: C.primary,
            background: C.surface,
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${C.primary}44`)}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
      ))}
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: 14, marginTop: -14 }}>
    <span style={{
      background: C.sectionPill,
      borderRadius: 999,
      padding: "3px 16px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: C.text,
      fontFamily: font,
    }}>
      {title}
    </span>
  </div>
);

const FormCheck = ({ checked, onChange, label, hash = false }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, cursor: "pointer", fontFamily: font }}>
    {hash && <span style={{ fontSize: 13, fontWeight: 700 }}>#</span>}
    <span
      onClick={() => onChange(!checked)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, flexShrink: 0,
        border: `1.5px solid ${C.border}`,
        background: C.surface,
      }}
    >
      {checked && <span style={{ fontSize: 14, fontWeight: 900, lineHeight: 1, color: C.primary }}>✓</span>}
    </span>
    <span>{label}</span>
  </label>
);

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textMuted, fontFamily: font }}>
      {label}
    </span>
    {children}
  </div>
);

const Section = ({ children, style = {} }) => (
  <section style={{
    border: `1px solid ${C.border}`,
    padding: "16px 16px 16px",
    paddingTop: 20,
    marginTop: 20,
    ...style,
  }}>
    {children}
  </section>
);

const TextInput = ({ value, onChange, style = {} }) => (
  <input
    value={value}
    onChange={onChange}
    style={{
      height: 30, width: "100%", border: `1px solid ${C.border}`,
      padding: "0 8px", fontSize: 13, fontWeight: 600,
      fontFamily: fontMono, color: C.primary, background: C.surface, outline: "none",
      boxSizing: "border-box",
      ...style,
    }}
    onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${C.primary}44`)}
    onBlur={(e) => (e.target.style.boxShadow = "none")}
  />
);

/* ─── Main form ──────────────────────────────────────────── */
const MGLForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { document.title = "MGL PNG Application Form"; }, []);

  const [f, setF] = useState({
    title: "", fullName: "",
    flat: "", floor: "", wing: "", plot: "", sector: "",
    building: "", society: "", area: "", pincode: "",
    email: "", mobile: "", altNo: "",
    occupancy: "owner", rentDeclare: false,
    idAadhar: false, idVoter: false, idDriving: false, idPan: false,
    addrGov: false, addrSale: false, addrSociety: false, addrHouse: false,
    hasLpg: "", lpgConsumer: "", lpgBrand: "", lpgDistributor: "",
    payment: "", chequeId: "", bank: "", date: "", amount: "6385",
    received: false, paperless: false, declDate: "", name: "",
  });


  // const location = useLocation();
  
useEffect(() => {
    const data = location.state?.formData;
    if (!data) return;

    setF((prev) => ({
      ...prev,
      title: data.title?.toUpperCase() || "",
      fullName: data.full_name?.toUpperCase() || "",
      flat: data.flat_house_number || "",
      building: data.building_name || "",
      area: data.area_location || "",
      pincode: data.pincode || "",
      mobile: data.mobile_number || "",
      occupancy: data.ownership_status === "owner_occupier" ? "owner" : "tenant",
      bank: data.bank_name || "",
      chequeId: "000067",
      date: "2026-03-28",
      idAadhar: data.proof_of_identity === "Aadhar Card",
      addrGov: data.proof_of_address === "Government ID",
      payment: data.payment_proof?.includes("cheque") ? "cheque" : "online",
      name: data.signature_name || "",
    }));
  }, [location.state]);  const handleButtonClick = () => {
    setFormData(data);
  };

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const [submitMsg, setSubmitMsg] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!f.fullName || !f.flat || !f.building || !f.area || !f.pincode || !f.mobile) {
      setSubmitMsg({ type: "error", text: "Please fill all mandatory fields (*)" });
      setTimeout(() => setSubmitMsg(null), 3000);
      return;
    }
    setSubmitMsg({ type: "success", text: "Application submitted successfully!" });
    setTimeout(() => setSubmitMsg(null), 4000);
  };

  return (
    <main style={{ minHeight: "100vh", background: C.bg, padding: "24px 12px", fontFamily: font }}>
      <form onSubmit={submit} style={{ maxWidth: 900, margin: "0 auto", background: C.surface, padding: 28, boxShadow: "0 4px 24px #0002" }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, borderBottom: `2px solid ${C.border}`, paddingBottom: 16 }}>
          <div style={{ background: C.accent, borderRadius: 999, padding: "10px 24px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.primary, margin: 0, letterSpacing: "-0.01em" }}>
              MAHANAGAR GAS LIMITED
            </h2>
            <p style={{ fontSize: 10, color: C.textMuted, margin: "4px 0 0" }}>
              MGL House, G-33 Bandra Kurla Complex, Bandra (East), Mumbai - 400 051.
            </p>
            <p style={{ fontSize: 10, color: C.textMuted, margin: "2px 0 0" }}>
              Customer care # 6867 45 00 / 6156 4500. Website: www.mahanagargas.com
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, fontWeight: 600, margin: 0 }}>MGL COPY</p>
            <p style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 900, letterSpacing: 4, margin: "4px 0 0" }}>*****</p>
          </div>
        </header>

        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {["APPLICATION FORM-CUM-RECEIPT FOR SUPPLY OF PIPED NATURAL GAS (PNG)", "FULL PAYMENT SCHEME"].map((t) => (
            <span key={t} style={{ background: C.sectionPill, borderRadius: 999, padding: "4px 16px", fontSize: 11, fontWeight: 700 }}>{t}</span>
          ))}
        </div>

        {/* ── Personal Details ── */}
        <Section>
          <SectionHeader title="PERSONAL DETAILS  (TO BE FILLED IN BLOCK LETTERS ONLY)" />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 20 }}>
            <Field label={<>Mr./ Mrs./ Miss./ M/s./ Dr. <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={5} value={f.title} onChange={(v) => set("title", v)} />
            </Field>
            <Field label={<>FULL NAME (AS PER ID SUBMITTED) <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={28} value={f.fullName} onChange={(v) => set("fullName", v)} />
            </Field>
          </div>
        </Section>

        {/* ── Installation Address ── */}
        <Section>
          <SectionHeader title="INSTALLATION ADDRESS  (TO BE FILLED IN BLOCK LETTERS ONLY)" />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px 20px" }}>
            <Field label={<>FLAT / HOUSE NO. <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={5} value={f.flat} onChange={(v) => set("flat", v)} />
            </Field>
            <Field label="FLOOR">
              <BoxInput length={3} value={f.floor} onChange={(v) => set("floor", v)} />
            </Field>
            <Field label="WING">
              <BoxInput length={3} value={f.wing} onChange={(v) => set("wing", v)} />
            </Field>
            <Field label="PLOT NO">
              <BoxInput length={4} value={f.plot} onChange={(v) => set("plot", v)} />
            </Field>
            <Field label="SECTOR NO">
              <BoxInput length={4} value={f.sector} onChange={(v) => set("sector", v)} />
            </Field>
            <Field label={<>BUILDING NAME / NUMBER <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={16} value={f.building} onChange={(v) => set("building", v)} />
            </Field>
            <Field label="SOCIETY NAME">
              <BoxInput length={20} value={f.society} onChange={(v) => set("society", v)} />
            </Field>
            <Field label={<>AREA / LOCATION <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={16} value={f.area} onChange={(v) => set("area", v)} />
            </Field>
            <Field label={<>PINCODE <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={6} value={f.pincode} onChange={(v) => set("pincode", v)} numeric />
            </Field>
            <Field label="EMAIL ID">
              <BoxInput length={28} value={f.email} onChange={(v) => set("email", v)} uppercase={false} />
            </Field>
            <Field label={<>MOBILE NO. <span style={{ color: C.red }}>*</span></>}>
              <BoxInput length={10} value={f.mobile} onChange={(v) => set("mobile", v)} numeric />
            </Field>
          </div>

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                <FormCheck checked={f.occupancy === "owner"} onChange={() => set("occupancy", "owner")} label="I AM OWNER & OCCUPIER" />
                <FormCheck checked={f.occupancy === "rent"} onChange={() => set("occupancy", "rent")} label="MY PREMISES IS GIVEN ON RENT" />
                <FormCheck checked={f.occupancy === "tenant"} onChange={() => set("occupancy", "tenant")} label="I AM TENANT" />
              </div>
              <FormCheck
                checked={f.rentDeclare}
                onChange={(v) => set("rentDeclare", v)}
                label="I declare that my premises is given on Rent. I will inform MGL if I start using PNG for myself."
              />
            </div>
            <div>
              <Field label="ALTERNATE NO.">
                <BoxInput length={10} value={f.altNo} onChange={(v) => set("altNo", v)} numeric />
              </Field>
              <p style={{ marginTop: 4, textAlign: "right", fontSize: 9 }}>
                <span style={{ color: C.red }}>*</span> MANDATORY FIELD
              </p>
            </div>
          </div>
        </Section>

        {/* ── Proof + Payment (2-col) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, marginTop: 20 }}>

          {/* Proof */}
          <Section style={{ marginTop: 0 }}>
            <SectionHeader title="ADDRESS & IDENTITY PROOF  (TO BE ENCLOSED)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                  PROOF OF IDENTITY <span style={{ fontWeight: 400 }}>(Please tick any one)(✓)</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <FormCheck hash checked={f.idAadhar} onChange={(v) => set("idAadhar", v)} label="Aadhar Card" />
                  <FormCheck hash checked={f.idVoter} onChange={(v) => set("idVoter", v)} label="Voter Id / Passport" />
                  <FormCheck hash checked={f.idDriving} onChange={(v) => set("idDriving", v)} label="Driving License" />
                  <FormCheck checked={f.idPan} onChange={(v) => set("idPan", v)} label="Pan Card" />
                </div>
              </div>

              <div>
                <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                  PROOF OF ADDRESS <span style={{ fontWeight: 400 }}>(Please tick any one)(✓)</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <FormCheck checked={f.addrGov} onChange={(v) => set("addrGov", v)} label="Government ID like (#) with above installation address" />
                  <FormCheck checked={f.addrSociety} onChange={(v) => set("addrSociety", v)} label="Society Document (Share Certificate / Letter / Maintenance Bill), etc." />
                  <FormCheck checked={f.addrSale} onChange={(v) => set("addrSale", v)} label="Sale Deed / Lease deed Agreement to sale, etc." />
                  <FormCheck checked={f.addrHouse} onChange={(v) => set("addrHouse", v)} label="House Tax Receipt / Electricity Bill / Company letter" />
                </div>
                <p style={{ marginTop: 8, fontSize: 9, fontStyle: "italic" }}>
                  If ID proof (#) is with above installation address, only one proof will suffice for 'identity' & 'address'.
                </p>
              </div>

              <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, margin: 0 }}>
                    DO YOU HAVE A LPG<br />CONNECTION IN YOUR NAME?
                  </p>
                  <FormCheck checked={f.hasLpg === "yes"} onChange={() => set("hasLpg", "yes")} label="YES" />
                  <FormCheck checked={f.hasLpg === "no"} onChange={() => set("hasLpg", "no")} label="NO" />
                </div>
                <div style={{ marginTop: 10 }}>
                  <Field label="LPG CONSUMER NO:">
                    <BoxInput length={18} value={f.lpgConsumer} onChange={(v) => set("lpgConsumer", v)} />
                  </Field>
                </div>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11 }}>(IF YES, TICK (✓))</span>
                  {["Indane", "Bharat Gas", "Hp Gas", "Other"].map((b) => (
                    <FormCheck key={b} checked={f.lpgBrand === b} onChange={() => set("lpgBrand", b)} label={b} />
                  ))}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Field label="LPG DISTRIBUTOR NAME">
                    <BoxInput length={16} value={f.lpgDistributor} onChange={(v) => set("lpgDistributor", v)} />
                  </Field>
                </div>
              </div>
            </div>
          </Section>

          {/* Payment */}
          <Section style={{ marginTop: 0 }}>
            <SectionHeader title="PAYMENT DETAILS  (NO CASH PAYMENT ACCEPTED)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, margin: 0 }}>TYPE OF PAYMENT</p>
                <FormCheck checked={f.payment === "online"} onChange={() => set("payment", "online")} label="ONLINE / UPI" />
                <FormCheck checked={f.payment === "cheque"} onChange={() => set("payment", "cheque")} label="CHEQUE" />
              </div>
              <Field label="CHEQUE / TXN ID">
                <TextInput value={f.chequeId} onChange={(e) => set("chequeId", e.target.value.toUpperCase())} />
              </Field>
              <Field label="BANK NAME">
                <TextInput value={f.bank} onChange={(e) => set("bank", e.target.value.toUpperCase())} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="DATE">
                  <input
                    type="date"
                    value={f.date}
                    onChange={(e) => set("date", e.target.value)}
                    style={{ height: 30, width: "100%", border: `1px solid ${C.border}`, padding: "0 6px", fontSize: 13, fontWeight: 600, color: C.primary, background: C.surface, outline: "none", boxSizing: "border-box" }}
                  />
                </Field>
                <Field label="AMOUNT (₹)">
                  <TextInput value={f.amount} onChange={(e) => set("amount", e.target.value)} />
                </Field>
              </div>
              <p style={{ fontSize: 9 }}>
                Please pay by Cheque / DD In Favour Of "Mahanagar Gas Ltd." Cheque subject to realisation
              </p>
              <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 10, fontSize: 10 }}>
                <p style={{ margin: 0 }}><strong>RTGS / NEFT DETAILS</strong> - Name: MAHANAGAR GAS LTD &nbsp; IFSC: YESB 0000 001</p>
                <p style={{ margin: "2px 0 0" }}>Account Number: 0001814 0000 5803 &nbsp; Bank: YES Bank, Worli, Mumbai- 400018</p>
              </div>
              <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, margin: "0 0 6px" }}>AMOUNT TO BE PAID WITH APPLICATION FORM</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 11, lineHeight: 1.8 }}>
                  <li>₹ 750/- Non Refundable Application Charges.</li>
                  <li>₹ 4500/- Interest Free Refundable Security Deposit for Gas Connection*</li>
                  <li>₹ 1000/- Interest Free Refundable Security Deposit for Gas Consumption</li>
                  <li>₹ 135/- GST @18% of Application Charges.</li>
                  <li style={{ fontWeight: 700 }}>₹ 6385/- Total Amount</li>
                </ul>
                <p style={{ marginTop: 6, fontSize: 9, fontStyle: "italic" }}>
                  *Total Security Deposit is ₹ 5000. ₹ 4500/- with form & balance ₹ 500/- in first bill.
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Declaration ── */}
        <Section>
          <SectionHeader title="DECLARATION BY APPLICANT" />
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 11, lineHeight: 1.9 }}>
            <li>I/We declare the above details are true & correct and authorize MGL to verify the same.</li>
            <li>I/We acknowledge that we will visit www.mahanagargas.com for latest terms and conditions which shall be binding on me/us.</li>
            <li>I/We agree that this application can be accepted or rejected by Mahanagar Gas Ltd., without assigning any reason thereof.</li>
            <li>I/We agree to surrender the LPG Connection within 60 days of activation of PNG Connection OR keep the LPG Connection in safe Custody.</li>
          </ol>

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FormCheck checked={f.received} onChange={(v) => set("received", v)} label="I have received a copy of application form" />
              <FormCheck checked={f.paperless} onChange={(v) => set("paperless", v)} label="I want to go green and opt for paperless billing." />
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>DATE</span>
                <BoxInput length={8} value={f.declDate} onChange={(v) => set("declDate", v)} numeric />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ height: 80, width: 220, border: `1px solid ${C.border}` }} />
              <span style={{ marginTop: 4, fontSize: 9, fontWeight: 600 }}>APPLICANT SIGNATURE</span>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>NAME</span>
                <input
                  value={f.name}
                  onChange={(e) => set("name", e.target.value.toUpperCase())}
                  style={{ height: 28, width: 220, border: "none", borderBottom: `1.5px solid ${C.border}`, padding: "0 6px", fontSize: 13, fontWeight: 600, fontFamily: fontMono, color: C.primary, background: "transparent", outline: "none" }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, borderTop: `1px solid ${C.borderLight}`, paddingTop: 10, fontSize: 10 }}>
            <p style={{ margin: 0 }}><strong>NOTE:</strong></p>
            <p style={{ margin: "4px 0 0" }}>
              1. For any details/queries, please call Customer Care. 2. Application Charges refundable if premises "TECHNICALLY NOT FEASIBLE". 3. Other charges as per standard Rate card on www.mahanagargas.com. 4. Report cash demands to vigilance@mahanagargas.com. 5. Incomplete forms not accepted. 6. MGL bill is not proof of ownership.
            </p>
          </div>
        </Section>

        {/* ── For Office Use ── */}
        <Section>
          <SectionHeader title="FOR OFFICE USE" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {[["BP NO.", 10, false], ["APPLICATION NO", 10, false], ["RECEIVED DATE", 8, true]].map(([lbl, len, num]) => (
              <Field key={lbl} label={lbl}>
                <BoxInput length={len} value="" onChange={() => {}} numeric={num} />
              </Field>
            ))}
          </div>
        </Section>

        {/* ── Submit ── */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
          {submitMsg && (
            <span style={{
              fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 4,
              background: submitMsg.type === "success" ? "#e6f9ed" : "#fdecea",
              color: submitMsg.type === "success" ? C.primary : C.red,
              border: `1px solid ${submitMsg.type === "success" ? C.primary : C.red}`,
            }}>
              {submitMsg.text}
            </span>
          )}
          <button
            type="submit"
            style={{
              background: C.primary, color: C.primaryFg,
              padding: "10px 28px", fontSize: 13, fontWeight: 700,
              border: "none", cursor: "pointer", letterSpacing: "0.04em",
              fontFamily: font,
              transition: "opacity 0.15s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.85)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            Submit Application
          </button>
        </div>
      </form>
      <button
  onClick={() =>
    navigate("/voice2", {
      state: { backgroundLocation: location },
    })
  }
  style={{
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#1a6b2e",
    color: "white",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    pointerEvents: "auto"
  }}
>
  💬
</button>
    </main>
  );
};

export default MGLForm;

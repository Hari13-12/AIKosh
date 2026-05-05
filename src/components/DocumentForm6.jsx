import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const BoxInput = ({
  length,
  value,
  onChange,
  uppercase = true,
  numeric = false,
  className = "",
}) => {
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
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className={`flex flex-wrap gap-[2px] ${className}`}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={c}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          inputMode={numeric ? "numeric" : "text"}
          maxLength={1}
          className="h-7 w-7 border border-foreground/60 text-center text-sm font-semibold uppercase text-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ))}
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="-mt-7 mb-3 flex items-center">
    <span className="rounded-full bg-[hsl(95,55%,75%)] px-4 py-1 text-xs font-bold tracking-wide text-foreground">
      {title}
    </span>
  </div>
);

const FormCheck = ({ checked, onChange, label, hash = false }) => (
  <label className="flex cursor-pointer items-center gap-2 text-xs">
    {hash && <span className="text-sm font-bold">#</span>}
    <span
      onClick={() => onChange(!checked)}
      className="flex h-5 w-5 shrink-0 items-center justify-center border border-foreground/70"
    >
      {checked && (
        <span className="text-base font-bold leading-none text-primary">✓</span>
      )}
    </span>
    <span>{label}</span>
  </label>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-medium uppercase tracking-wide text-foreground/80">
      {label}
    </span>
    {children}
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "MGL PNG Application Form";
  }, []);

  const [f, setF] = useState({
    title: "",
    fullName: "",
    flat: "",
    floor: "",
    wing: "",
    plot: "",
    sector: "",
    building: "",
    society: "",
    area: "",
    pincode: "",
    email: "",
    mobile: "",
    altNo: "",
    occupancy: "owner",
    rentDeclare: false,
    idAadhar: false,
    idVoter: false,
    idDriving: false,
    idPan: false,
    addrGov: false,
    addrSale: false,
    addrSociety: false,
    addrHouse: false,
    hasLpg: "",
    lpgConsumer: "",
    lpgBrand: "",
    lpgDistributor: "",
    payment: "",
    chequeId: "",
    bank: "",
    date: "",
    amount: "6385",
    received: false,
    paperless: false,
    declDate: "",
    name: "",
  });

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (
      !f.fullName ||
      !f.flat ||
      !f.building ||
      !f.area ||
      !f.pincode ||
      !f.mobile
    ) {
      toast.error("Please fill all mandatory fields (*)");
      return;
    }
    toast.success("Application submitted successfully");
  };

  return (
    <main className="min-h-screen bg-muted/30 py-6">
      <form
        onSubmit={submit}
        className="mx-auto max-w-5xl bg-background p-4 shadow-sm md:p-8"
      >
    <h1 className="sr-only">Mahanagar Gas Limited PNG Application Form</h1>

        <header className="flex items-start justify-between gap-4 border-b pb-4">
          <div className="rounded-full bg-[hsl(55,90%,75%)] px-6 py-3">
            <h2 className="text-xl font-bold text-primary md:text-2xl">MAHANAGAR GAS LIMITED</h2>
            <p className="text-[10px] text-foreground/80">
              MGL House, G-33 Bandra Kurla Complex, Bandra (East), Mumbai - 400 051.
            </p>
            <p className="text-[10px] text-foreground/80">
              Customer care # 6867 45 00 / 6156 4500. Website: www.mahanagargas.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold">MGL COPY</p>
            <p className="font-mono text-xl font-bold tracking-wider">*****</p>
          </div>
        </header>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[hsl(95,55%,75%)] px-4 py-1.5 text-xs font-bold">
            APPLICATION FORM-CUM-RECEIPT FOR SUPPLY OF PIPED NATURAL GAS (PNG)
          </span>
          <span className="rounded-full bg-[hsl(95,55%,75%)] px-4 py-1.5 text-xs font-bold">FULL PAYMENT SCHEME</span>
        </div>

        <section className="mt-8 border border-foreground/40 px-4 pb-4 pt-2">
          <SectionHeader title="PERSONAL DETAILS  (TO BE FILLED IN BLOCK LETTERS ONLY)" />
          <div className="flex flex-wrap items-end gap-6">
            <Field label={<>Mr./ Mrs./ Miss./ M/s./ Dr. <span className="text-destructive">*</span></>}>
              <BoxInput length={5} value={f.title} onChange={(v) => set("title", v)} />
            </Field>
            <Field label={<>FULL NAME (AS PER ID SUBMITTED) <span className="text-destructive">*</span></>}>
              <BoxInput length={28} value={f.fullName} onChange={(v) => set("fullName", v)} />
            </Field>
          </div>
        </section>

        <section className="mt-6 border border-foreground/40 px-4 pb-4 pt-2">
          <SectionHeader title="INSTALLATION ADDRESS  (TO BE FILLED IN BLOCK LETTERS ONLY)" />
          <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
            <Field label={<>FLAT / HOUSE NO. <span className="text-destructive">*</span></>}>
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
            <Field label={<>BUILDING NAME / NUMBER <span className="text-destructive">*</span></>}>
              <BoxInput length={16} value={f.building} onChange={(v) => set("building", v)} />
            </Field>

            <Field label="SOCIETY NAME">
              <BoxInput length={20} value={f.society} onChange={(v) => set("society", v)} />
            </Field>
            <Field label={<>AREA / LOCATION <span className="text-destructive">*</span></>}>
              <BoxInput length={16} value={f.area} onChange={(v) => set("area", v)} />
            </Field>
            <Field label={<>PINCODE <span className="text-destructive">*</span></>}>
              <BoxInput length={6} value={f.pincode} onChange={(v) => set("pincode", v)} numeric />
            </Field>

            <Field label="EMAIL ID">
              <BoxInput length={28} value={f.email} onChange={(v) => set("email", v)} uppercase={false} />
            </Field>
            <Field label={<>MOBILE NO. <span className="text-destructive">*</span></>}>
              <BoxInput length={10} value={f.mobile} onChange={(v) => set("mobile", v)} numeric />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-6">
                <FormCheck
                  checked={f.occupancy === "owner"}
                  onChange={() => set("occupancy", "owner")}
                  label="I AM OWNER & OCCUPIER"
                />
                <FormCheck
                  checked={f.occupancy === "rent"}
                  onChange={() => set("occupancy", "rent")}
                  label="MY PREMISES IS GIVEN ON RENT"
                />
                <FormCheck
                  checked={f.occupancy === "tenant"}
                  onChange={() => set("occupancy", "tenant")}
                  label="I AM TENANT"
                />
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
              <p className="mt-1 text-right text-[10px]">
                <span className="text-destructive">*</span> MANDATORY FIELD
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="border border-foreground/40 px-4 pb-4 pt-2">
            <SectionHeader title="ADDRESS & IDENTITY PROOF  (TO BE ENCLOSED)" />
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-bold">
                  PROOF OF IDENTITY <span className="font-normal">(Please tick any one)(✓)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <FormCheck hash checked={f.idAadhar} onChange={(v) => set("idAadhar", v)} label="Aadhar Card" />
                  <FormCheck hash checked={f.idVoter} onChange={(v) => set("idVoter", v)} label="Voter Id / Passport" />
                  <FormCheck hash checked={f.idDriving} onChange={(v) => set("idDriving", v)} label="Driving License" />
                  <FormCheck checked={f.idPan} onChange={(v) => set("idPan", v)} label="Pan Card" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold">
                  PROOF OF ADDRESS <span className="font-normal">(Please tick any one)(✓)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <FormCheck
                    checked={f.addrGov}
                    onChange={(v) => set("addrGov", v)}
                    label="Government ID like (#) with above installation address"
                  />
                  <FormCheck
                    checked={f.addrSociety}
                    onChange={(v) => set("addrSociety", v)}
                    label="Society Document (Share Certificate / Letter / Maintenance Bill), etc."
                  />
                  <FormCheck
                    checked={f.addrSale}
                    onChange={(v) => set("addrSale", v)}
                    label="Sale Deed / Lease deed Agreement to sale, etc."
                  />
                  <FormCheck
                    checked={f.addrHouse}
                    onChange={(v) => set("addrHouse", v)}
                    label="House Tax Receipt / Electricity Bill / Company letter"
                  />
                </div>
                <p className="mt-2 text-[10px] italic">
                  If ID proof (#) is with above installation address, only one proof will suffice for 'identity' &
                  'address'.
                </p>
              </div>

              <div className="border-t pt-3">
                <div className="flex flex-wrap items-center gap-6">
                  <p className="text-xs font-semibold">
                    DO YOU HAVE A LPG
                    <br />
                    CONNECTION IN YOUR NAME?
                  </p>
                  <FormCheck checked={f.hasLpg === "yes"} onChange={() => set("hasLpg", "yes")} label="YES" />
                  <FormCheck checked={f.hasLpg === "no"} onChange={() => set("hasLpg", "no")} label="NO" />
                </div>
                <div className="mt-3">
                  <Field label="LPG CONSUMER NO:">
                    <BoxInput length={18} value={f.lpgConsumer} onChange={(v) => set("lpgConsumer", v)} />
                  </Field>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <span className="text-xs">(IF YES, TICK (✓))</span>
                  {["Indane", "Bharat Gas", "Hp Gas", "Other"].map((b) => (
                    <FormCheck key={b} checked={f.lpgBrand === b} onChange={() => set("lpgBrand", b)} label={b} />
                  ))}
                </div>
                <div className="mt-3">
                  <Field label="LPG DISTRIBUTOR NAME">
                    <BoxInput length={16} value={f.lpgDistributor} onChange={(v) => set("lpgDistributor", v)} />
                  </Field>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-foreground/40 px-4 pb-4 pt-2">
            <SectionHeader title="PAYMENT DETAILS  (NO CASH PAYMENT ACCEPTED)" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-6">
                <p className="text-xs font-semibold">TYPE OF PAYMENT</p>
                <FormCheck
                  checked={f.payment === "online"}
                  onChange={() => set("payment", "online")}
                  label="ONLINE / UPI"
                />
                <FormCheck checked={f.payment === "cheque"} onChange={() => set("payment", "cheque")} label="CHEQUE" />
              </div>
              <Field label="CHEQUE / TXN ID">
                <input
                  value={f.chequeId}
                  onChange={(e) => set("chequeId", e.target.value.toUpperCase())}
                  className="h-8 w-full border border-foreground/60 px-2 text-sm font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </Field>
              <Field label="BANK NAME">
                <input
                  value={f.bank}
                  onChange={(e) => set("bank", e.target.value.toUpperCase())}
                  className="h-8 w-full border border-foreground/60 px-2 text-sm font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="DATE">
                  <input
                    type="date"
                    value={f.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="h-8 w-full border border-foreground/60 px-2 text-sm font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </Field>
                <Field label="AMOUNT (₹)">
                  <input
                    value={f.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className="h-8 w-full border border-foreground/60 px-2 text-sm font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </Field>
              </div>
              <p className="text-[10px]">
                Please pay by Cheque / DD In Favour Of "Mahanagar Gas Ltd." Cheque subject to realisation
              </p>
              <div className="border-t pt-2 text-[10px]">
                <p>
                  <strong>RTGS / NEFT DETAILS</strong> - Name: MAHANAGAR GAS LTD &nbsp; IFSC: YESB 0000 001
                </p>
                <p>Account Number: 0001814 0000 5803 &nbsp; Bank: YES Bank, Worli, Mumbai- 400018</p>
              </div>
              <div className="border-t pt-2">
                <p className="text-xs font-bold">AMOUNT TO BE PAID WITH APPLICATION FORM</p>
                <ul className="mt-1 space-y-0.5 text-[11px]">
                  <li>₹ 750/- Non Refundable Application Charges.</li>
                  <li>₹ 4500/- Interest Free Refundable Security Deposit for Gas Connection*</li>
                  <li>₹ 1000/- Interest Free Refundable Security Deposit for Gas Consumption</li>
                  <li>₹ 135/- GST @18% of Application Charges.</li>
                  <li className="font-bold">₹ 6385/- Total Amount</li>
                </ul>
                <p className="mt-1 text-[10px] italic">
                  *Total Security Deposit is ₹ 5000. ₹ 4500/- with form & balance ₹ 500/- in first bill.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 border border-foreground/40 px-4 pb-4 pt-2">
          <SectionHeader title="DECLARATION BY APPLICANT" />
          <ol className="list-inside list-decimal space-y-1 text-[11px]">
            <li>I/We declare the above details are true & correct and authorize MGL to verify the same.</li>
            <li>
              I/We acknowledge that we will visit www.mahanagargas.com for latest terms and conditions which shall be
              binding on me/us.
            </li>
            <li>
              I/We agree that this application can be accepted or rejected by Mahanagar Gas Ltd., without assigning any
              reason thereof.
            </li>
            <li>
              I/We agree to surrender the LPG Connection within 60 days of activation of PNG Connection OR keep the LPG
              Connection in safe Custody.
            </li>
          </ol>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <FormCheck
                checked={f.received}
                onChange={(v) => set("received", v)}
                label="I have received a copy of application form"
              />
              <FormCheck
                checked={f.paperless}
                onChange={(v) => set("paperless", v)}
                label="I want to go green and opt for paperless billing."
              />
              <div className="mt-2 flex items-end gap-3">
                <span className="text-xs font-semibold">DATE</span>
                <BoxInput length={8} value={f.declDate} onChange={(v) => set("declDate", v)} numeric />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-56 border border-foreground/60" />
              <span className="mt-1 text-[10px] font-semibold">APPLICANT SIGNATURE</span>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-semibold">NAME</span>
                <input
                  value={f.name}
                  onChange={(e) => set("name", e.target.value.toUpperCase())}
                  className="h-7 w-56 border-b border-foreground/60 px-2 text-sm font-semibold text-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-2 text-[10px]">
            <p className="font-bold">NOTE:</p>
            <p>
              1. For any details/queries, please call Customer Care. 2. Application Charges refundable if premises
              "TECHNICALLY NOT FEASIBLE". 3. Other charges as per standard Rate card on www.mahanagargas.com. 4. Report
              cash demands to vigilance@mahanagargas.com. 5. Incomplete forms not accepted. 6. MGL bill is not proof of
              ownership.
            </p>
          </div>
        </section>

        <section className="mt-6 border border-foreground/40 px-4 pb-4 pt-2">
          <SectionHeader title="FOR OFFICE USE" />
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="BP NO.">
              <BoxInput length={10} value="" onChange={() => {}} />
            </Field>
            <Field label="APPLICATION NO">
              <BoxInput length={10} value="" onChange={() => {}} />
            </Field>
            <Field label="RECEIVED DATE">
              <BoxInput length={8} value="" onChange={() => {}} />
            </Field>
          </div>
        </section>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            className="rounded bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Submit Application
          </button>
        </div>
      </form>
    </main>
  );
};

export default Index;
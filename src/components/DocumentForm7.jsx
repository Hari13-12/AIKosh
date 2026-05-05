import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import "./Form.css";

/* ------------------ BoxInput ------------------ */
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

/* ------------------ SectionHeader ------------------ */
const SectionHeader = ({ title }) => (
  <div className="-mt-7 mb-3 flex items-center">
    <span className="rounded-full bg-[hsl(95,55%,75%)] px-4 py-1 text-xs font-bold tracking-wide text-foreground">
      {title}
    </span>
  </div>
);

/* ------------------ FormCheck ------------------ */
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

/* ------------------ Field ------------------ */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-medium uppercase tracking-wide text-foreground/80">
      {label}
    </span>
    {children}
  </div>
);

/* ------------------ MAIN ------------------ */
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
        <h1 className="sr-only">
          Mahanagar Gas Limited PNG Application Form
        </h1>

        {/* HEADER */}
        <header className="flex items-start justify-between gap-4 border-b pb-4">
          <div className="rounded-full bg-[hsl(55,90%,75%)] px-6 py-3">
            <h2 className="text-xl font-bold text-primary md:text-2xl">
              MAHANAGAR GAS LIMITED
            </h2>
          </div>
        </header>

        {/* PERSONAL DETAILS */}
        <section className="mt-8 border px-4 pb-4 pt-2">
          <SectionHeader title="PERSONAL DETAILS" />
          <Field label="FULL NAME">
            <BoxInput
              length={28}
              value={f.fullName}
              onChange={(v) => set("fullName", v)}
            />
          </Field>
        </section>

        {/* ADDRESS */}
        <section className="mt-6 border px-4 pb-4 pt-2">
          <SectionHeader title="ADDRESS" />
          <Field label="FLAT">
            <BoxInput
              length={5}
              value={f.flat}
              onChange={(v) => set("flat", v)}
            />
          </Field>
        </section>

        {/* SUBMIT */}
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-500 text-white px-6 py-2">
            Submit Application
          </button>
        </div>
      </form>
    </main>
     <button
  className="chatbot-float-btn"
  onClick={() =>
    navigate("/voice2", {
      state: { backgroundLocation: location },
    })
  }
>
  💬
</button>
  );
};

export default Index;
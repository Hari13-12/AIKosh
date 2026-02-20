import React, { useEffect, useState } from "react";
import "./DocumentForm4.css";
import Input from "./Input";

const DocumentForm3 = () => {
  const [loading, setLoading] = useState(true);
  const [loadingSnp, setLoadingSnp] = useState(false);
  const [snpResults, setSnpResults] = useState([]);

  const [formData, setFormData] = useState({
    aadhaar_number: "",
    name_on_aadhaar: "",
    gst_number: "",
    pan_number: "",
    udyam_registration_number: "",
    enterprise_name: "",
    enterprise_type: "",
    major_activity: "",
    address_of_enterprise: "",
    business_name: "",
    type: [],
    location: [],
    ship_days: "",
    return_allowed: "",
    cancellation_allowed: "",
    msme: "",
    sector: "",
    primary_category: "",
    subcategory: "",
    des: "",
    state: "",
    monthly_capacity: "",
    delivery_scope: "",
    logistics_support: "",
    catalog_support: "",
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        fetch("http://localhost:8080/ocr-results"),
        fetch("http://localhost:8000/agent-result"),
      ]);
      const data1 = await res1.json();
      const data2 = await res2.json();
      const merged = {
        ...(data1?.ocr_response || {}),
        ...(data2?.agent_response || {}),
      };
      setFormData((prev) => ({ ...prev, ...merged }));
    } catch (err) {
      console.error("Failed to load form data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSnp(true);
      const res = await fetch("http://localhost:8000/ai-snp");
      const data = await res.json();
      setSnpResults(data["recommended-snps"] || []);
    } catch (err) {
      console.error("SNP API failed:", err);
    } finally {
      setLoadingSnp(false);
    }
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="form-container">
        <div className="form-loading">
          <div className="form-loading-spinner" />
          Fetching your document data…
        </div>
      </div>
    );
  }

  /* ── MAIN ── */
  return (
    <div className="form-container">
      <div className="form-shell">

        {/* PAGE HEADER */}
        <div className="form-page-header">
          <div className="form-eyebrow">
            {/* <span className="form-eyebrow-line" />
            MSME TEAM Initiative */}
          </div>
          <h1 className="form-page-title">
            Onboarding <span>Form</span>
          </h1>
          {/* <p className="form-page-sub">
            Review and confirm your auto-filled details before generating scheme recommendations.
          </p> */}
        </div>
<br />
        <form onSubmit={handleSubmit}>

          {/* 🔷 IDENTITY */}
          <div className="form-section">
            {/* <div className="form-section-icon ic-navy"> */}
            <div className="form-section-header">
              <div className="form-section-icon ic-navy">🪪</div>
              <h3>Identity Details</h3>
            </div>
            <div className="form-section-body">
              <div className="grid-2">
                <Input label="Aadhaar Number"        name="aadhaar_number"          value={formData.aadhaar_number}          onChange={handleChange} readOnly />
                <Input label="Name on Aadhaar"       name="name_on_aadhaar"         value={formData.name_on_aadhaar}         onChange={handleChange} />
                <Input label="PAN Number"            name="pan_number"              value={formData.pan_number}              onChange={handleChange} />
                <Input label="GST Number"            name="gst_number"              value={formData.gst_number}              onChange={handleChange} />
                <Input label="Udyam Registration"    name="udyam_registration_number" value={formData.udyam_registration_number} onChange={handleChange} />
              </div>
            </div>
          </div>
          {/* </div> */}

          {/* 🔷 ENTERPRISE */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon ic-orange">🏭</div>
              <h3>Enterprise Details</h3>
            </div>
            <div className="form-section-body">
              <div className="grid-2">
                <Input label="Enterprise Name"  name="enterprise_name"  value={formData.enterprise_name}  onChange={handleChange} />
                <Input label="Enterprise Type"  name="enterprise_type"  value={formData.enterprise_type}  onChange={handleChange} />
                <Input label="Major Activity"   name="major_activity"   value={formData.major_activity}   onChange={handleChange} />
                <Input label="Business Name"    name="business_name"    value={formData.business_name}    onChange={handleChange} />
                <Input label="MSME"             name="msme"             value={formData.msme}             onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* 🔷 BUSINESS CAPABILITY */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon ic-teal">📦</div>
              <h3>Business Capability</h3>
            </div>
            <div className="form-section-body">
              <div className="grid-2">
                <Input label="Sector"            name="sector"            value={formData.sector}            onChange={handleChange} />
                <Input label="Primary Category"  name="primary_category"  value={formData.primary_category}  onChange={handleChange} />
                <Input label="Subcategory"       name="subcategory"       value={formData.subcategory}       onChange={handleChange} />
                <Input label="Monthly Capacity"  name="monthly_capacity"  value={formData.monthly_capacity}  onChange={handleChange} />
                <Input label="Delivery Scope"    name="delivery_scope"    value={formData.delivery_scope}    onChange={handleChange} />
                <Input label="Logistics Support" name="logistics_support" value={formData.logistics_support} onChange={handleChange} />
                <Input label="Catalog Support"   name="catalog_support"   value={formData.catalog_support}   onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* 🔷 LOCATION */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon ic-gold">📍</div>
              <h3>Location</h3>
            </div>
            <div className="form-section-body">
              <div className="grid-2">
                <Input label="State"   name="state"                  value={formData.state}                  onChange={handleChange} />
                <Input label="Address" name="address_of_enterprise"  value={formData.address_of_enterprise}  onChange={handleChange} />
                <Input
                  label="Locations"
                  name="location"
                  value={formData.location?.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value.split(",").map((v) => v.trim()),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="ai-btn">
            ✦ Generate SNP Recommendations
          </button>

        </form>

        {/* SNP LOADING */}
        {loadingSnp && (
          <div className="snp-loading">
            <div className="snp-loading-bar" />
            Analysing your profile and matching schemes…
          </div>
        )}

        {/* SNP RESULTS */}
        {snpResults.length > 0 && (
          <div className="snp-container">
            <div className="snp-container-header">
              <h2 className="snp-container-title">Recommended SNPs</h2>
              <span className="snp-count-badge">{snpResults.length} matches</span>
            </div>

            {snpResults.map((snp) => (
              <div className="snp-card" key={snp.snp_id}>
                <div className="snp-header">
                  <h3>{snp.snp_name}</h3>
                  <span className="score-badge">Score: {snp.final_score}</span>
                </div>
                <div className="snp-grid">
                  <p><b>Sector Match:</b> {String(snp.explanation?.sector_match)}</p>
                  <p><b>Primary Category:</b> {String(snp.explanation?.primary_category_match)}</p>
                  <p><b>Subcategory:</b> {String(snp.explanation?.subcategory_match)}</p>
                  <p><b>State Match:</b> {String(snp.explanation?.state_match)}</p>
                  <p><b>Capacity Score:</b> {snp.explanation?.capacity_score}</p>
                  <p><b>Logistics:</b> {snp.explanation?.logistics_support}</p>
                  <p><b>Catalog:</b> {snp.explanation?.catalog_support}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DocumentForm3;
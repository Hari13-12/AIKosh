import React, { useEffect, useState } from "react";
import "./DocumentForm.css";

const DocumentForm = () => {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

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

  const [loadingSnp, setLoadingSnp] = useState(false);
  const [snpResults, setSnpResults] = useState([]);


  // 🔥 CALL BOTH APIs ON LOAD
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

      console.log("MERGED", merged);

      setFormData((prev) => ({
        ...prev,
        ...merged,
      }));
    } catch (err) {
      console.error("Failed to load form data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting for SNP:", formData);

  try {
    setLoadingSnp(true);

    const res = await fetch("http://localhost:8000/ai-snp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await res.json();

    console.log("SNP RESPONSE", data);

    setSnpResults(data["recommended-snps"] || []);
  } catch (err) {
    console.error("SNP API failed:", err);
  } finally {
    setLoadingSnp(false);
  }
};


  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="form-container">
        <h2>Loading form data...</h2>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Document Details Form</h2>

      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/_/g, " ").toUpperCase()}</label>

            {Array.isArray(formData[key]) ? (
              <input
                type="text"
                name={key}
                value={formData[key]?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [key]: e.target.value
                      .split(",")
                      .map((v) => v.trim()),
                  })
                }
              />
            ) : (
              <input
                type="text"
                name={key}
                value={formData[key] ?? ""}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        {/* <button type="submit" className="submit-btn">
          Submit Form
        </button> */}
        <button type="submit" className="ai-btn">
          SNP Recommendation
        </button>
      </form>

      {/* 🔥 SUCCESS POPUP */}
      {/* 🔥 SNP LOADING */}
{loadingSnp && (
  <div style={{ marginTop: 30, textAlign: "center" }}>
    <h3>Getting SNP Recommendations...</h3>
  </div>
)}

{/* 🔥 SNP RESULTS */}
{snpResults.length > 0 && (
  <div className="snp-container">
    <h2>🎯 Recommended SNPs</h2>

    {snpResults.map((snp) => (
      <div className="snp-card" key={snp.snp_id}>
        <div className="snp-header">
          <h3>{snp.snp_name}</h3>
          <span className="score-badge">{snp.final_score}</span>
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
  );
};

export default DocumentForm;

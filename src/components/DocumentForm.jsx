// import React, { useState } from "react";
// import "./DocumentForm.css";

// const DocumentForm = () => {
//   const [formData, setFormData] = useState({
//     aadhaar_number: "283109879930",
//     name_on_aadhaar: "Ranjith E",
//     date_of_birth: "1999-09-11",
//     personal_address:
//       "C/O S/O Elumalai, NO 219, SREE RAMA ANJANEYAR TEMPLE, VASANTHAPURAM, MANGADU, Kancheepuram, Tamil Nadu-600122",
//     gst: "33AABTC0738L1ZV",
//     pan_number: "DCVPJ3055C",
//     udyam_registration_number: "UDYAM-GJ-24-0037086",
//     enterprise_name: "K P ENTERPRISE",
//     enterprise_type: "MICRO",
//     major_activity: "SERVICES",
//     name_of_unit: "Flat/Door/Block No. Village/Town FF-15 Vadodara",
//     address_of_enterprise:
//       "Road/Street/Lane G.I.D.C Road, Manjalpur City Vadodara State District GUJARAT VADODARA, Pin 390011",
//     business_name: "H k Traders",
//     type: ["Selling packet items"],
//     location: ["On North tramitor"],
//     ship_days: 3,
//     return_allowed: "no",
//     cancellation_allowed: "yes",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted Data:", formData);
//     alert("Form submitted successfully!");
//   };

//   return (
//     <div className="form-container">
//       <h2>Document Details Form</h2>

//       <form onSubmit={handleSubmit}>
//         {Object.keys(formData).map((key) => (
//           <div className="form-group" key={key}>
//             <label>{key.replace(/_/g, " ").toUpperCase()}</label>

//             {Array.isArray(formData[key]) ? (
//               <input
//                 type="text"
//                 name={key}
//                 value={formData[key].join(", ")}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     [key]: e.target.value.split(","),
//                   })
//                 }
//               />
//             ) : (
//               <input
//                 type="text"
//                 name={key}
//                 value={formData[key]}
//                 onChange={handleChange}
//               />
//             )}
//           </div>
//         ))}

//         <button type="submit" className="submit-btn">
//           Save Details
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DocumentForm;



import React, { useEffect, useState } from "react";
import "./DocumentForm.css";

const DocumentForm = () => {
  const [loading, setLoading] = useState(true);

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
        ...(data2?.ocr_response || {}),
      };

      setFormData((prev) => ({
        ...prev,
        ...merged,
      }));
    } catch (err) {
      console.error("Failed to load form data:", err);
    }

    setLoading(false);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
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

        <button type="submit" className="submit-btn">
          Save Details
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;

import React from "react";

const Input = ({ label, name, value, onChange, readOnly = false }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default Input;

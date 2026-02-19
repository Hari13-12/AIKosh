export const uploadDocument = async (file, docType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", docType);

  const response = await fetch("http://127.0.0.1:8080/upload-file", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
};

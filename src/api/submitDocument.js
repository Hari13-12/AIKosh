export const submitDocuments = async (uploadedDocs) => {
  const response = await fetch("http://127.0.0.1:8080/process-files", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documents: uploadedDocs,
    }),
  });

  if (!response.ok) {
    throw new Error("Submit failed");
  }

  return response.json();
};

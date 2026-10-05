
import React, { useState } from "react";
import api from "../services/api";
import "./PolicyUpload.css";

function PolicyUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setMessage("");
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("policyFile", file);

      const response = await api.post(
        "/policies/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        response.data.message ||
          "Policy uploaded successfully."
      );

      setFile(null);

      // Clear file input
      document.getElementById("policy-file").value = "";

      // Refresh left-side policy list
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error.response?.data?.message ||
          "Policy upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="policy-upload-card">

      <div className="policy-upload-header">
        <h2>Upload Company Policy</h2>

        <p>
          Upload a PDF policy document for the AI assistant.
        </p>
      </div>

      <div className="upload-area">

        <input
          id="policy-file"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

        {file && (
          <div className="selected-file">
            📄 {file.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading
            ? "Uploading..."
            : "Upload Policy"}
        </button>

      </div>

      {message && (
        <p className="upload-success">
          {message}
        </p>
      )}

      {error && (
        <p className="upload-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default PolicyUpload;

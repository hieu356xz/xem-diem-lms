"use client";

import { useState } from "react";
import { processHeaders } from "@/app/actions/process";

type HeaderInputProps = {
  onHeadersProcessed: (
    headers: Record<string, string>,
    studentId: number | null,
    classId: number | null
  ) => void;
};

export default function HeaderInput({ onHeadersProcessed }: HeaderInputProps) {
  const [headersString, setHeadersString] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { headers, studentId, classId } = await processHeaders(
        headersString
      );
      onHeadersProcessed(headers, studentId, classId);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Paste Request Headers</h2>
      <textarea
        className="textarea-input"
        rows={10}
        placeholder="Paste your request headers here..."
        value={headersString}
        onChange={(e) => setHeadersString(e.target.value)}></textarea>
      <button
        className="button-primary"
        onClick={handleSubmit}
        disabled={loading}>
        {loading ? "Processing..." : "Process Headers"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

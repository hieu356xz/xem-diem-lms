"use client";

import { useMutation } from "@tanstack/react-query";
import { processHeaders } from "@/app/services/process";
import { ProcessHeadersResult } from "@/app/types";

type HeaderInputProps = {
  onHeadersProcessed: (
    headers: Record<string, string>,
    studentId: number | null,
    classId: number | null
  ) => void;
};

export default function HeaderInput({ onHeadersProcessed }: HeaderInputProps) {
  const mutation = useMutation<ProcessHeadersResult, Error, string>({
    mutationFn: (headersText) => processHeaders(headersText),
    onSuccess: (result) => {
      onHeadersProcessed(result.headers, result.studentId, result.classId);
    },
    onError: (error) => {
      console.error("Header processing error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const headersText = formData.get("headers-textarea") as string;
    mutation.mutate(headersText);
  };

  return (
    <div className="card">
      <h2 className="card-title">Dán header requests vào đây</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea-input"
          name="headers-textarea"
          rows={16}
          spellCheck="false"
          required
          placeholder="Dán header requests vào đây..."></textarea>
        <button
          className="button-primary"
          type="submit"
          disabled={mutation.isPending}>
          {mutation.isPending ? "Đang xử lý..." : "Submit"}
        </button>
      </form>
      {mutation.error && (
        <p className="error-message">{mutation.error.message}</p>
      )}
    </div>
  );
}

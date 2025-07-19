"use client";

import { useState } from "react";
import HeaderInput from "@/components/HeaderInput";
import ClassSelector from "@/components/ClassSelector";
import TestResultsDisplay from "@/components/TestResultsDisplay";

export default function Home() {
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [studentId, setStudentId] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);

  const handleHeadersProcessed = (
    processedHeaders: Record<string, string>,
    processedStudentId: number | null,
    processedClassId: number | null
  ) => {
    setHeaders(processedHeaders);
    setStudentId(processedStudentId);
    setClassId(processedClassId);
  };

  const handleClassSelected = (
    selectedClassId: number,
    selectedClassName: string
  ) => {
    setClassId(selectedClassId);
    setClassName(selectedClassName);
  };

  return (
    <main className="main-container">
      <h1 className="main-heading">Xem điểm LMS ICTU</h1>

      {!studentId && (
        <HeaderInput onHeadersProcessed={handleHeadersProcessed} />
      )}

      {studentId && !classId && (
        <ClassSelector
          headers={headers}
          studentId={studentId}
          onClassSelected={handleClassSelected}
        />
      )}

      {studentId && classId && className && (
        <TestResultsDisplay
          headers={headers}
          classId={classId}
          className={className}
        />
      )}
    </main>
  );
}

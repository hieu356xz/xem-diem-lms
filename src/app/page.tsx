"use client";

import { useState, useEffect } from "react";
import HeaderInput from "@/components/HeaderInput";
import ClassSelector from "@/components/ClassSelector";
import TestResultsDisplay from "@/components/TestResultsDisplay";

export default function Home() {
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [studentId, setStudentId] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  // const [hasMounted, setHasMounted] = useState(false);

  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

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
    // setClassName(selectedClassName);
  };

  // console.log("Headers:", headers);
  // console.log("Student ID:", studentId);
  // console.log("Class ID:", classId);

  // if (!hasMounted) {
  //   return null; // Render nothing on the server, or a loading spinner
  // }

  return (
    <main className="main-container">
      <h1 className="main-heading">Xem điểm LMS ICTU</h1>

      {<HeaderInput onHeadersProcessed={handleHeadersProcessed} />}

      {
        <ClassSelector
          headers={headers}
          studentId={studentId}
          onClassSelected={handleClassSelected}
        />
      }

      {
        <TestResultsDisplay
          headers={headers}
          classId={classId}
          className={className}
        />
      }
    </main>
  );
}

"use client";

import { useState } from "react";
import { getAllTestResults, getTestDetails } from "@/app/actions/tests";
import { TestDetailData, TestResultData } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

type TestResultsDisplayProps = {
  headers: Record<string, string>;
  classId: number | null;
  className: string | null;
};

type WeekOption = {
  value: number;
  label: string;
};

export default function TestResultsDisplay({
  headers,
  classId,
  className,
}: TestResultsDisplayProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  const {
    data: testResults,
    isLoading: isLoadingTestResults,
    error: testResultsError,
  } = useQuery<TestResultData[]>({
    queryKey: ["testResults", headers, classId, selectedWeek],
    queryFn: async () => {
      if (!headers || !classId || selectedWeek === null) return [];
      const response = await getAllTestResults(headers, classId, selectedWeek);
      console.log("Test results response:", response);
      return response?.data || [];
    },
    enabled: !!headers && !!classId && selectedWeek !== null,
  });

  const {
    data: detailedTest,
    isLoading: isLoadingDetailedTest,
    error: detailedTestError,
  } = useQuery<TestDetailData>({
    queryKey: ["detailedTest", expandedTestId, headers],
    queryFn: async () => {
      if (!expandedTestId || !headers) {
        throw new Error("Test ID or headers are missing.");
      }
      const response = await getTestDetails(headers, expandedTestId);
      console.log("Detailed test response:", response);
      if (!response?.data || response.data.length === 0) {
        throw new Error("Failed to fetch test details.");
      }
      return response.data[0];
    },
    enabled: !!expandedTestId && !!headers,
  });

  const handleTestClick = (testId: number) => {
    if (expandedTestId === testId) {
      setExpandedTestId(null);
    } else {
      setExpandedTestId(testId);
    }
  };

  console.log("class ID:", classId);
  console.log("selected week:", selectedWeek);
  console.log("test results:", testResults);
  console.log("detailed test:", detailedTest);

  const weeks: WeekOption[] = Array.from(
    new Set(testResults?.map((test) => test.week) || [])
  )
    .sort((a, b) => a - b)
    .map((week) => ({ value: week, label: `Week ${week}` }));

  if (isLoadingTestResults) return <p>Loading test results...</p>;
  if (testResultsError)
    return <p className="error-message">Error: {testResultsError.message}</p>;
  if (isLoadingDetailedTest) return <p>Loading test details...</p>;
  if (detailedTestError)
    return <p className="error-message">Error: {detailedTestError.message}</p>;

  return (
    <div className="card">
      <h2 className="card-title">Test Results for {className}</h2>

      <div className="form-group">
        <label htmlFor="week-select" className="form-label">
          Select Week:
        </label>
        <select
          id="week-select"
          className="select-input"
          value={selectedWeek || ""}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}>
          <option value="">Select a week</option>
          {weeks.map((week) => (
            <option key={week.value} value={week.value}>
              {week.label}
            </option>
          ))}
        </select>
      </div>

      {selectedWeek && testResults && testResults.length > 0 ? (
        <div>
          <h3 className="section-title">Tests for Week {selectedWeek}</h3>
          {testResults.map((test) => (
            <div key={test.id} className="test-item">
              <div
                className="test-item-header"
                onClick={() => handleTestClick(test.id)}>
                <p className="test-id">Test ID: {test.id}</p>
                <p className="test-score">Score: {test.tong_diem}</p>
                <button className="button-link">
                  {expandedTestId === test.id ? "Collapse" : "Expand"}
                </button>
              </div>
              {expandedTestId === test.id && detailedTest && (
                <div className="test-details-json">
                  <pre className="json-display">
                    {JSON.stringify(detailedTest, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        selectedWeek && <p>No test results found for Week {selectedWeek}.</p>
      )}
    </div>
  );
}

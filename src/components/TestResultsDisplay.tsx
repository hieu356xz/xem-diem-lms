"use client";

import { useState, useEffect } from "react";
import { getAllTestResults, getTestDetails } from "@/app/actions/tests";
import { AllTestResultsResponse, TestDetailData } from "@/app/types";

type TestResultsDisplayProps = {
  headers: Record<string, string>;
  classId: number;
  className: string;
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
  const [testResults, setTestResults] = useState<AllTestResultsResponse | null>(
    null
  );
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [detailedTest, setDetailedTest] = useState<TestDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      if (!selectedWeek) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getAllTestResults(
          headers,
          classId,
          selectedWeek
        );
        if (response) {
          setTestResults(response);
        } else {
          setError("Failed to fetch test results.");
        }
      } catch (err: any) {
        setError(
          err.message ||
            "An unknown error occurred while fetching test results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [headers, classId, selectedWeek]);

  const handleTestClick = async (testId: number) => {
    if (expandedTestId === testId) {
      setExpandedTestId(null);
      setDetailedTest(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getTestDetails(headers, testId);
      if (response && response.data && response.data.length > 0) {
        setDetailedTest(response.data[0]);
        setExpandedTestId(testId);
      } else {
        setError("Failed to fetch test details.");
      }
    } catch (err: any) {
      setError(
        err.message || "An unknown error occurred while fetching test details."
      );
    } finally {
      setLoading(false);
    }
  };

  const weeks: WeekOption[] = Array.from(
    new Set(testResults?.data.map((test) => test.week) || [])
  )
    .sort((a, b) => a - b)
    .map((week) => ({ value: week, label: `Week ${week}` }));

  if (loading && !testResults) return <p>Loading test results...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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

      {selectedWeek && testResults && testResults.data.length > 0 ? (
        <div>
          <h3 className="section-title">Tests for Week {selectedWeek}</h3>
          {testResults.data.map((test) => (
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

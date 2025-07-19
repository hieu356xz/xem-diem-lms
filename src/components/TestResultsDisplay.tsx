"use client";

import { useState } from "react";
import { getAllTestResults, getTestDetails } from "@/app/services/tests";
import { getCoursePlan } from "@/app/services/classes";
import {
  TestDetailData,
  TestResultData,
  CoursePlanActivityData,
} from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    data: coursePlan,
    isLoading: isLoadingCoursePlan,
    error: coursePlanError,
  } = useQuery<CoursePlanActivityData[]>({
    queryKey: ["coursePlan", headers, classId],
    queryFn: async () => {
      if (!headers || !classId) return [];
      const response = await getCoursePlan(headers, classId);
      console.log("Course plan response:", response);
      return response?.data || [];
    },
    enabled: !!headers && !!classId,
  });

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

  const weeks: WeekOption[] = Array.from(
    new Set(coursePlan?.map((plan) => plan.week) || [])
  )
    .sort((a, b) => a - b)
    .map((week) => ({ value: week, label: `Tuần ${week}` }));

  return (
    <div className="card">
      <h2 className="card-title">
        {className ? className : "Chưa chọn môn học"}
      </h2>

      {isLoadingCoursePlan ? (
        <p className="loading-message">Đang tải danh sách tuần học</p>
      ) : coursePlanError ? (
        <p className="error-message">
          Đã có lỗi xảy ra {coursePlanError.message}
        </p>
      ) : (
        <div className="form-group">
          <label htmlFor="week-select" className="form-label">
            Chọn tuần học:
          </label>
          <select
            id="week-select"
            className="select-input"
            value={selectedWeek || ""}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}>
            <option value="">--- Chọn tuần học ---</option>
            {weeks.map((week) => (
              <option key={week.value} value={week.value}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoadingTestResults ? (
        <p className="loading-message">Đang tải kết quả các bài kiểm tra...</p>
      ) : testResultsError ? (
        <p className="error-message">
          Đã có lỗi xảy ra: {testResultsError.message || "Lỗi không xác định"}
        </p>
      ) : selectedWeek && testResults && testResults.length > 0 ? (
        <div>
          <h3 className="section-title">
            Kết quả các bài kiểm tra cho tuần {selectedWeek}
          </h3>
          {testResults.map((test) => (
            <Accordion
              key={test.id}
              className="test-accordion"
              expanded={expandedTestId === test.id}
              onChange={() => handleTestClick(test.id)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${test.id}-content`}
                className="test-summary"
                id={`panel${test.id}-header`}>
                <Typography className="test-score">
                  Điểm: {(test.tong_diem / 10).toFixed(1)}
                </Typography>
                <Typography className="test-id">{`(ID: ${test.id})`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {isLoadingDetailedTest && expandedTestId === test.id ? (
                  <p>Đang tải kết quả bài kiểm tra...</p>
                ) : detailedTestError && expandedTestId === test.id ? (
                  <p className="error-message">
                    Đã có lỗi xảy ra:{" "}
                    {detailedTestError.message || "Lỗi không xác định"}
                  </p>
                ) : (
                  expandedTestId === test.id &&
                  detailedTest && (
                    <pre className="json-display">
                      {JSON.stringify(detailedTest, null, 2)}
                    </pre>
                  )
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ) : (
        selectedWeek && (
          <p>Không có kết quả bài kiểm tra nào cho tuần {selectedWeek}.</p>
        )
      )}
    </div>
  );
}

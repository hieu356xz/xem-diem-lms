"use client";

import { useState, useEffect } from "react";
import { getAllClasses, getClassDetails } from "@/app/actions/classes";
import { ClassStudentData, ClassDetailData } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

type ClassSelectorProps = {
  headers: Record<string, string>;
  studentId: number | null;
  onClassSelected: (classId: number, className: string) => void;
};

export default function ClassSelector({
  headers,
  studentId,
  onClassSelected,
}: ClassSelectorProps) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const {
    data: allClasses,
    isLoading: isLoadingClasses,
    error: classesError,
  } = useQuery<ClassStudentData[]>({
    queryKey: ["classes", headers, studentId],
    queryFn: async () => {
      if (!headers || !studentId) return [];
      const response = await getAllClasses(headers, studentId);
      return response?.data || [];
    },
    enabled: !!headers && studentId !== null,
  });

  const {
    data: classDetails,
    isLoading: isLoadingClassDetails,
    error: classDetailsError,
  } = useQuery<ClassDetailData>({
    queryKey: ["classDetails", selectedClassId, headers],
    queryFn: async () => {
      if (!selectedClassId || !headers) {
        throw new Error("Class ID or headers are missing.");
      }
      const response = await getClassDetails(headers, selectedClassId);
      if (!response?.data) {
        throw new Error("Failed to fetch class details.");
      }
      return response.data;
    },
    enabled: !!selectedClassId && !!headers,
  });

  useEffect(() => {
    if (selectedClassId && classDetails) {
      onClassSelected(selectedClassId, classDetails.name);
    }
  }, [selectedClassId, classDetails, onClassSelected]);

  const years = Array.from(new Set(allClasses?.map((c) => c.namhoc))).map(
    (year) => ({ value: year, label: year })
  );

  const semesters = Array.from(
    new Set(
      allClasses?.filter((c) => c.namhoc === selectedYear).map((c) => c.hocky)
    )
  )
    .sort((a, b) => a - b)
    .map((semester) => ({ value: semester, label: `Học kỳ ${semester}` }));

  const classesForSelection = allClasses
    ?.filter((c) => c.namhoc === selectedYear && c.hocky === selectedSemester)
    .map((c) => ({ value: c.class_id, label: `Class ID: ${c.class_id}` }));

  const handleClassSelect = (classId: number) => {
    setSelectedClassId(classId);
  };

  if (isLoadingClasses) return <p>Loading classes...</p>;
  if (classesError)
    return <p className="error-message">Error: {classesError.message}</p>;
  if (isLoadingClassDetails) return <p>Loading class details...</p>;
  if (classDetailsError)
    return <p className="error-message">Error: {classDetailsError.message}</p>;

  return (
    <div className="card">
      <h2 className="card-title">Chọn môn học</h2>
      <div className="form-group">
        <label htmlFor="year-select" className="form-label">
          Năm học:
        </label>
        <select
          id="year-select"
          className="select-input"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedSemester(null);
            setSelectedClassId(null);
          }}
          disabled={years.length === 0}>
          {years.length === 0 ? (
            <option value="">Không có năm học nào</option>
          ) : (
            <>
              <option value="">Chọn 1 năm học</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {
        <div className="form-group">
          <label htmlFor="semester-select" className="form-label">
            Học kỳ:
          </label>
          <select
            id="semester-select"
            className="select-input"
            value={selectedSemester || ""}
            onChange={(e) => {
              setSelectedSemester(parseInt(e.target.value));
              setSelectedClassId(null);
            }}
            disabled={!selectedYear || semesters.length === 0}>
            {semesters.length === 0 ? (
              <option value="">Không có học kỳ nào</option>
            ) : (
              <>
                <option value="">Chọn 1 học kỳ</option>
                {semesters.map((semester) => (
                  <option key={semester.value} value={semester.value}>
                    {semester.label}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      }

      {
        <div className="form-group">
          <label htmlFor="class-select" className="form-label">
            Môn học:
          </label>
          <select
            id="class-select"
            className="select-input"
            value={selectedClassId || ""}
            onChange={(e) => handleClassSelect(parseInt(e.target.value))}
            disabled={
              !selectedSemester ||
              !classesForSelection ||
              classesForSelection.length === 0
            }>
            {!classesForSelection || classesForSelection.length === 0 ? (
              <option value="">Không có môn học nào</option>
            ) : (
              <>
                <option value="">Chọn 1 môn học</option>
                {classesForSelection?.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      }
    </div>
  );
}

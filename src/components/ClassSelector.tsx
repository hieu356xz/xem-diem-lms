"use client";

import { useState, useEffect } from "react";
import { getAllClasses, getClassDetails } from "@/app/actions/classes";
import { ClassStudentData, ClassDetailData } from "@/app/types";

type ClassSelectorProps = {
  headers: Record<string, string>;
  studentId: number;
  onClassSelected: (classId: number, className: string) => void;
};

type SelectOption = {
  value: string | number;
  label: string;
};

export default function ClassSelector({
  headers,
  studentId,
  onClassSelected,
}: ClassSelectorProps) {
  const [allClasses, setAllClasses] = useState<ClassStudentData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllClasses(headers, studentId);
        if (response && response.data) {
          setAllClasses(response.data);
        } else {
          setError("Failed to fetch classes.");
        }
      } catch (err: any) {
        setError(
          err.message || "An unknown error occurred while fetching classes."
        );
      } finally {
        setLoading(false);
      }
    };

    if (studentId && Object.keys(headers).length > 0) {
      fetchClasses();
    }
  }, [headers, studentId]);

  const years = Array.from(new Set(allClasses.map((c) => c.namhoc))).map(
    (year) => ({ value: year, label: year })
  );

  const semesters = Array.from(
    new Set(
      allClasses.filter((c) => c.namhoc === selectedYear).map((c) => c.hocky)
    )
  )
    .sort((a, b) => a - b)
    .map((semester) => ({ value: semester, label: `Học kỳ ${semester}` }));

  const classesForSelection = allClasses
    .filter((c) => c.namhoc === selectedYear && c.hocky === selectedSemester)
    .map((c) => ({ value: c.class_id, label: `Class ID: ${c.class_id}` }));

  const handleClassSelect = async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const classDetail = await getClassDetails(headers, classId);
      if (classDetail && classDetail.data) {
        onClassSelected(classId, classDetail.data.name);
      } else {
        setError("Failed to fetch class details.");
      }
    } catch (err: any) {
      setError(
        err.message || "An unknown error occurred while fetching class details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="card">
      <h2 className="card-title">Select Class</h2>
      <div className="form-group">
        <label htmlFor="year-select" className="form-label">
          School Year:
        </label>
        <select
          id="year-select"
          className="select-input"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedSemester(null);
            setSelectedClassId(null);
          }}>
          <option value="">Select a year</option>
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>

      {selectedYear && (
        <div className="form-group">
          <label htmlFor="semester-select" className="form-label">
            Semester:
          </label>
          <select
            id="semester-select"
            className="select-input"
            value={selectedSemester || ""}
            onChange={(e) => {
              setSelectedSemester(parseInt(e.target.value));
              setSelectedClassId(null);
            }}>
            <option value="">Select a semester</option>
            {semesters.map((semester) => (
              <option key={semester.value} value={semester.value}>
                {semester.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedYear && selectedSemester && (
        <div className="form-group">
          <label htmlFor="class-select" className="form-label">
            Class:
          </label>
          <select
            id="class-select"
            className="select-input"
            value={selectedClassId || ""}
            onChange={(e) => {
              const classId = parseInt(e.target.value);
              setSelectedClassId(classId);
              handleClassSelect(classId);
            }}>
            <option value="">Select a class</option>
            {classesForSelection.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

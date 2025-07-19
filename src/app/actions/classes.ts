"use server";

import { fetcher } from "./fetcher";
import { ClassStudentResponse, ClassDetailResponse } from "../types";

export async function getAllClasses(
  headers: Record<string, string>,
  studentId: number
): Promise<ClassStudentResponse> {
  const queryParams = {
    limit: 1000,
    paged: 1,
    select: "namhoc,hocky,class_id",
    "condition[0][key]": "student_id",
    "condition[0][value]": studentId,
    "condition[0][compare]": "=",
  };

  return await fetcher<ClassStudentResponse>("class-students/", {
    headers,
    queryParams,
  });
}

export async function getClassDetails(
  headers: Record<string, string>,
  classId: number
): Promise<ClassDetailResponse> {
  const queryParams = {
    with: "managers",
  };

  return await fetcher<ClassDetailResponse>(`class/${classId}`, {
    headers,
    queryParams,
  });
}

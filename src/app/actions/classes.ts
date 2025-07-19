"use server";

import { fetcher } from "./fetcher";
import {
  ClassStudentResponse,
  ClassDetailResponse,
  CoursePlanResponse,
} from "../types";

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

export async function getCoursePlan(
  headers: Record<string, string>,
  classId: number
): Promise<CoursePlanResponse> {
  const queryParams = {
    limit: 1000,
    paged: 1,
    orderby: "week",
    order: "ASC",
    select:
      "id,class_id,course_id,course_plan_activity_id,week,title,date_start_of_week,date_end_of_week,teaching_day",
    "condition[0][key]": "class_id",
    "condition[0][value]": classId,
    "condition[0][compare]": "=",
    "condition[1][key]": "week",
    "condition[1][value]": 1000,
    "condition[1][compare]": "<>",
  };

  return await fetcher<CoursePlanResponse>("class-plans/", {
    headers,
    queryParams,
  });
}

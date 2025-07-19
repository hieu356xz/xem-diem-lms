"use server";

import { fetcher } from "./fetcher";
import { AllTestResultsResponse, TestDetailResponse } from "../types";

export async function getAllTestResults(
  headers: Record<string, string>,
  classId: number,
  week: number
): Promise<AllTestResultsResponse | null> {
  const queryParams = {
    limit: 1000,
    paged: 1,
    order: "ASC",
    orderby: "id",
    "condition[0][key]": "week",
    "condition[0][value]": week,
    "condition[0][compare]": "==",
    "condition[1][key]": "class_id",
    "condition[1][value]": classId,
    "condition[1][compare]": "==",
    "condition[1][type]": "and",
  };

  return fetcher<AllTestResultsResponse>("class-plan-activity-student-tests/", {
    headers,
    queryParams,
  });
}

export async function getTestDetails(
  headers: Record<string, string>,
  testId: number
): Promise<TestDetailResponse | null> {
  const queryParams = {
    select:
      "id,class_plan_activity_id,av,class_id,time,questions,course_id,status",
    with: "test",
    "condition[0][key]": "id",
    "condition[0][value]": testId,
    "condition[0][compare]": "==",
  };

  return fetcher<TestDetailResponse>("class-plan-activity-student-tests/", {
    headers,
    queryParams,
  });
}

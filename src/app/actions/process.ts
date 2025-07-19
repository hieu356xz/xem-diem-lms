"use server";

import getICTUQueryParams from "@/utils/get_ictu_query_params";
import { fetcher } from "./fetcher";
import { UserProfileResponse, ProcessHeadersResult } from "../types";

export async function processHeaders(
  headersString: string
): Promise<ProcessHeadersResult> {
  const lines = headersString
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { headers: {}, studentId: null, classId: null };
  }

  const requestLine = lines[0];
  const headers: Record<string, string> = {};
  let studentId: number | null = null;
  let classId: number | null = null;

  // Parse headers from the second line onwards
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const separatorIndex = line.indexOf(":");
    if (separatorIndex > -1) {
      const key = line.substring(0, separatorIndex).trim();
      const value = line.substring(separatorIndex + 1).trim();
      headers[key] = value;
    }
  }

  // Try to get student_id and class_id from the request line using getICTUQueryParams
  const queryParams = getICTUQueryParams(requestLine);
  if (queryParams) {
    if (queryParams["student_id"]) {
      studentId = parseInt(queryParams["student_id"]);
    }
    if (queryParams["class_id"]) {
      classId = parseInt(queryParams["class_id"]);
    }
  }

  // If studentId is still null, fetch it from the user-profile endpoint
  if (studentId === null) {
    try {
      const userProfile = await fetcher<UserProfileResponse>("user-profile/", {
        headers,
      });

      if (userProfile && userProfile.data && userProfile.data.length > 0) {
        studentId = userProfile.data[0].id;
      } else {
        // If fetcher returns null or data is empty, it means no user profile found or an issue occurred.
        // Since fetcher now throws on HTTP errors, this case handles valid responses with no data.
        throw new Error("Không tìm thấy thông tin sinh viên.");
      }
    } catch (error: unknown) {
      // Re-throw the error from fetcher or a new error with more context
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Đã có lỗi xảy ra: ${errorMessage}`);
    }
  }

  return { headers, studentId, classId };
}

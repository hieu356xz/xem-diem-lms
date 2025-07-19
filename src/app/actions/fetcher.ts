"use server";

import getRequestSignature from "@/utils/get_request_signature";
import { BaseResponse, ErrorResponse } from "@/app/types";

type FetcherOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  queryParams?: Record<string, string | number | null>;
};

export async function fetcher<T>(
  url: string,
  options?: FetcherOptions
): Promise<T | ErrorResponse> {
  const {
    method = "GET",
    headers = {},
    body = {},
    queryParams = {},
  } = options || {};

  const baseUrl = "https://apps.ictu.edu.vn:9087/ionline/api/";
  let fullUrl = `${baseUrl}${url}`;

  const signature = getRequestSignature(method, headers, body);
  const requestHeaders = {
    ...headers,
    "x-request-signature": signature,
  };

  // Append query parameters for GET requests
  if (method === "GET" && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();
    fullUrl = `${fullUrl}?${queryString}`;
  }

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (["POST", "PUT"].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      let errorData: BaseResponse;
      try {
        errorData = await response.json();
        console.error("Response details:", errorData);
      } catch {
        return {
          code: "parse_error",
          status: 400,
          error: "Không thể phân tích phản hồi.",
        };
      }
      const errorMessage = errorData.message || "Lỗi không xác định";
      console.error(
        `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
      );
      return {
        code: errorData.code || "unknown_error",
        status: response.status,
        error: errorMessage,
      };
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi lấy dữ liệu từ máy chủ.";
    console.error("Error fetching data:", errorMessage);
    return {
      code: "fetch_error",
      status: 500,
      error: errorMessage,
    };
  }
}

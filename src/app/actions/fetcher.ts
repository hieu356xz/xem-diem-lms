"use server";

import getRequestSignature from "@/utils/get_request_signature";

type FetcherOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  queryParams?: Record<string, string | number | null>;
};

export async function fetcher<T>(
  url: string,
  options?: FetcherOptions
): Promise<T | null> {
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
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

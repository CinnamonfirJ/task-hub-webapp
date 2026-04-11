import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuthError?: boolean;
}

export const apiData = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Only append application/json if sending non-FormData payload and Content-Type isn't overridden
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  } else if (headers["Content-Type"]) {
    // Ensure fetch sets the proper multipart boundary for FormData
    delete headers["Content-Type"];
  }

  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    console.log(`[API Request] ${options.method || "GET"} ${endpoint}`, {
      hasToken: !!token,
      tokenType: typeof token,
      tokenPreview:
        token && typeof token === "string"
          ? `${token.substring(0, 5)}...${token.slice(-5)}`
          : typeof token === "object"
            ? "OBJECT!"
            : token,
      headers: headers,
    });
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Request] ${options.method || "GET"} ${endpoint}`, {
        hasToken: !!token,
      });
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        if (options.skipAuthError) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[API 401] Unauthorized response from ${endpoint}, but skipAuthError is true. Skipping global logout.`);
          }
          throw new Error("Unauthorized");
        }

        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[API 401] Unauthorized response from ${endpoint}. Clearing token.`,
          );
        }

        // Clear invalid token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");

          // Only redirect if not already on login/register pages to avoid loops
          const path = window.location.pathname;
          if (!path.includes("/login") && !path.includes("/register")) {
            window.location.href = "/login";
          }
        }
        throw new Error("Unauthorized");
      }

      const errorData = await response.json().catch(() => ({}));
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[API Error] ${response.status} from ${endpoint}:`,
          errorData,
        );
      }
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`,
      );
    }

    // Check if the response is empty (e.g. 204 No Content)
    if (response.status === 204) {
      if (
        process.env.NODE_ENV === "development" &&
        typeof window !== "undefined"
      ) {
        console.log(
          `[API Response] ${options.method || "GET"} ${endpoint}:`,
          "204 No Content - Empty response",
        );
      }
      return {} as T;
    }

    const data = await response.json();

    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      console.log(
        `[API Response] ${options.method || "GET"} ${endpoint}:`,
        data,
      );
    }

    return data;
  } catch (error: any) {
    if (error?.message !== "Unauthorized") {
      console.error("API Request Failed:", error);
    }
    throw error;
  }
};

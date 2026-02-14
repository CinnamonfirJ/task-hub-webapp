import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiData = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

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
        if (process.env.NODE_ENV === "development") {
          console.error(
            `[API 401] Unauthorized response from ${endpoint}. Clearing token.`,
          );
        }

        // Clear invalid token and redirect to login
        if (typeof window !== "undefined") {
          // localStorage.removeItem("token");
          // localStorage.removeItem("userType");

          // Only redirect if not already on login/register pages to avoid loops
          // const path = window.location.pathname;
          // if (!path.includes("/login") && !path.includes("/register")) {
          //   window.location.href = "/login";
          // }
          console.error(
            "401 Unauthorized received. Auto-logout disabled for debugging.",
          );
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
    console.error("API Request Failed:", error);
    throw error;
  }
};

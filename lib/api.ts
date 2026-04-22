import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL && typeof window !== "undefined") {
  console.error("CRITICAL: NEXT_PUBLIC_API_BASE_URL is not defined. API calls will fail.");
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuthError?: boolean;
  isDownload?: boolean;
  params?: Record<string, any>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
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

  // Handle query parameters
  let url = `${BASE_URL}${endpoint}`;
  if (options.params) {
    const urlObj = new URL(url);
    Object.keys(options.params).forEach(key => {
      if (options.params![key] !== undefined && options.params![key] !== null) {
        urlObj.searchParams.append(key, options.params![key].toString());
      }
    });
    url = urlObj.toString();
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
    const response = await fetch(url, config);


    if (!response.ok) {
      if (response.status === 401) {
        if (options.skipAuthError) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[API 401] Unauthorized response from ${endpoint}, but skipAuthError is true. Skipping global logout.`);
          }
          throw new ApiError("Unauthorized", 401, { code: "unauthorized" });
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
        throw new ApiError("Unauthorized", 401, { code: "unauthorized" });
      }

      const errorData = await response.json().catch(() => ({}));
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[API Error] ${response.status} from ${endpoint}:`,
          errorData,
        );
      }
      
      throw new ApiError(
        errorData.message || `Error ${response.status}: ${response.statusText}`,
        response.status,
        errorData
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

    // Detect file responses to return as Blobs instead of parsing as JSON
    const contentType = response.headers.get("Content-Type");
    const contentDisposition = response.headers.get("Content-Disposition");
    const isAttachment = contentDisposition?.includes("attachment");

    // Only treat as file if it's NOT JSON and (isDownload requested OR isAttachment OR has binary Content-Type)
    const isJson = contentType?.includes("application/json");
    const isFile = !isJson && (options.isDownload || isAttachment || (contentType && (
      contentType.includes("text/csv") ||
      contentType.includes("application/pdf") ||
      contentType.includes("application/vnd.ms-excel") ||
      contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      contentType.includes("application/octet-stream")
    )));

    if (isFile) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[API Response] ${options.method || "GET"} ${endpoint}: File detected (${contentType}) returning as Blob`);
      }
      return (await response.blob()) as any;
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
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error?.message !== "Unauthorized") {
      console.error("API Request Failed:", error);
    }
    throw error;
  }
};


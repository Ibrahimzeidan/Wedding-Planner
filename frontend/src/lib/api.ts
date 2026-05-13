const devApiUrl = process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:8000";

export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? devApiUrl).replace(/\/$/, "");

export async function getApiErrorMessage(response: Response) {
  try {
    const data: { detail?: unknown; message?: string } = await response.json();

    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => {
          if (typeof item === "object" && item && "msg" in item && typeof item.msg === "string") {
            return item.msg;
          }

          return null;
        })
        .filter(Boolean)
        .join(" ");
    }
  } catch {
    return "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export function getRequestErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof TypeError) {
    return `Could not connect to the API at ${apiBaseUrl}. Make sure the backend server is running.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

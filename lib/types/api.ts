/**
 * Standard API Response Envelope
 * Ensures deterministic, uniform JSON responses across all Server Actions and Route Handlers.
 */
export type ApiResponse<T = unknown> =
  | {
      success: true;
      data: T;
      error: null;
      timestamp: string;
    }
  | {
      success: false;
      data: null;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
      timestamp: string;
    };

export function apiSuccess<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

export function apiError(message: string, code: string = "BAD_REQUEST", details?: unknown): ApiResponse<never> {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

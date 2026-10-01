import "server-only";

export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_CONTENT_TYPE" | "INVALID_JSON" | "PAYLOAD_TOO_LARGE"
  ) {
    super(message);
  }
}
export async function readJsonBody(
  request: Request,
  maxBytes = 16_384
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new RequestBodyError("Content-Type must be application/json.", "INVALID_CONTENT_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyError("Request payload is too large.", "PAYLOAD_TOO_LARGE");
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    throw new RequestBodyError("Request payload is too large.", "PAYLOAD_TOO_LARGE");
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new RequestBodyError("Invalid JSON request body.", "INVALID_JSON");
  }
}

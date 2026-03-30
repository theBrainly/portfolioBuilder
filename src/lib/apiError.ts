import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Machine-readable error codes
// ---------------------------------------------------------------------------
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UPLOAD_FAILED"
  | "EMAIL_FAILED"
  | "DB_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "PAYMENT_FAILED"
  | "INTERNAL_ERROR";

// ---------------------------------------------------------------------------
// Custom application error
// ---------------------------------------------------------------------------
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = "INTERNAL_ERROR",
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ---------------------------------------------------------------------------
// Structured server-side logger
// ---------------------------------------------------------------------------
function logError(error: unknown, context: string) {
  const timestamp = new Date().toISOString();
  const errObj =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack?.split("\n").slice(0, 5).join("\n"),
        }
      : { raw: String(error) };

  console.error(
    JSON.stringify({ level: "error", timestamp, context, ...errObj })
  );
}

// ---------------------------------------------------------------------------
// Central API error handler — use in every route's catch block
// ---------------------------------------------------------------------------
export function handleApiError(error: unknown, context: string): NextResponse {
  // 1. Zod validation errors
  if (
    error instanceof Error &&
    error.name === "ZodError" &&
    "errors" in (error as any)
  ) {
    const zodErr = error as any;
    const message =
      zodErr.errors?.[0]?.message || "Invalid request data";
    return NextResponse.json(
      { success: false, error: message, code: "VALIDATION_ERROR" as ErrorCode },
      { status: 400 }
    );
  }

  // 2. Our own AppError (known operational errors)
  if (error instanceof AppError) {
    logError(error, context);
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  // 3. Mongoose duplicate-key error (code 11000)
  if (
    error instanceof Error &&
    "code" in (error as any) &&
    (error as any).code === 11000
  ) {
    logError(error, context);
    return NextResponse.json(
      { success: false, error: "A record with that value already exists", code: "CONFLICT" as ErrorCode },
      { status: 409 }
    );
  }

  // 4. Mongoose validation errors
  if (error instanceof Error && error.name === "ValidationError") {
    logError(error, context);
    const mongooseErr = error as any;
    const firstField = Object.keys(mongooseErr.errors || {})[0];
    const message = firstField
      ? mongooseErr.errors[firstField].message
      : "Validation failed";
    return NextResponse.json(
      { success: false, error: message, code: "VALIDATION_ERROR" as ErrorCode },
      { status: 400 }
    );
  }

  // 5. Mongoose cast errors (e.g. invalid ObjectId values)
  if (error instanceof Error && error.name === "CastError") {
    logError(error, context);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid identifier or request value",
        code: "VALIDATION_ERROR" as ErrorCode,
      },
      { status: 400 }
    );
  }

  // 6. Generic / unexpected errors — never leak internals
  logError(error, context);
  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      code: "INTERNAL_ERROR" as ErrorCode,
    },
    { status: 500 }
  );
}

// ---------------------------------------------------------------------------
// Shorthand helpers
// ---------------------------------------------------------------------------
export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized", code: "UNAUTHORIZED" as ErrorCode },
    { status: 401 }
  );
}

export function notFoundResponse(resource: string = "Resource") {
  return NextResponse.json(
    { success: false, error: `${resource} not found`, code: "NOT_FOUND" as ErrorCode },
    { status: 404 }
  );
}

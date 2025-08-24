import * as React from "react";

import { ErrorComponentProps } from "@tanstack/react-router";

export function DefaultErrorComponent({ error }: ErrorComponentProps) {
  const isDev = import.meta.env.NODE_ENV !== "production";
  const [showDetails, setShowDetails] = React.useState(isDev);
  const [copied, setCopied] = React.useState(false);

  const message = getErrorMessage(error);
  const stack = getErrorStack(error);
  const statusInfo = getStatusInfo(error);

  const reference = React.useMemo(() => makeReference(), []);
  const now = new Date().toISOString();
  const url = typeof window !== "undefined" ? window.location.href : "N/A";

  const detailsText = formatDetails({ message, stack, statusInfo, reference, now, url });

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(detailsText);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(t);
    } catch {
      // no-op
    }
  }

  const mailtoHref = makeMailto({
    subject: `App error (${reference})`,
    body: detailsText,
  });

  return (
    <main className="mx-auto grid min-h-[60vh] w-full max-w-2xl place-items-center px-4 py-12">
      <div className="w-full rounded border border-red-300 bg-red-50 p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-red-700">An error occurred</h1>
        {statusInfo && (
          <p className="mb-2">
            <strong>Status:</strong> {statusInfo.status} {statusInfo.statusText || ""}
          </p>
        )}
        <p className="mb-4 break-words">
          <strong>Message:</strong> {message}
        </p>

        <button
          onClick={() => setShowDetails((v) => !v)}
          className="mb-4 rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
        >
          {showDetails ? "Hide details" : "Show details"}
        </button>

        {showDetails && (
          <pre className="mb-4 max-h-64 w-full overflow-auto whitespace-pre-wrap break-all bg-white p-3 text-xs">
            {detailsText}
          </pre>
        )}

        {showDetails && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={copyDetails}
              className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
            >
              {copied ? "Copied!" : "Copy details"}
            </button>
            <a
              href={mailtoHref}
              className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
            >
              Report via email
            </a>
          </div>
        )}

        <p className="text-sm text-red-700">
          If the problem persists, please contact support with the reference code{" "}
          <strong>{reference}</strong>.
        </p>

        <div className="mt-6">
          {/* <Link
            to="/"
            className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
          >
            Go to homepage
          </Link> */}
        </div>
      </div>
    </main>
  );
}

function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (isResponse(err)) {
    return `${err.status} ${err.statusText || "Response error"}`;
  }
  if (err instanceof Error && err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function getErrorStack(err: unknown): string | undefined {
  if (err instanceof Error && err.stack) return err.stack;
  return undefined;
}

function isResponse(x: unknown): x is Response {
  return (
    typeof x === "object" &&
    x !== null &&
    "status" in x &&
    typeof (x as { status?: unknown }).status === "number" &&
    "statusText" in x
  );
}

function getStatusInfo(err: unknown): { status: number; statusText?: string } | null {
  if (isResponse(err)) {
    return { status: err.status, statusText: err.statusText };
  }
  // Some libs attach status fields on thrown objects
  if (
    err &&
    typeof err === "object" &&
    "status" in err &&
    typeof (err as Record<string, unknown>).status === "number"
  ) {
    const status = (err as Record<string, unknown>).status as number;
    const statusText = (err as Record<string, unknown>).statusText as string | undefined;
    return { status, statusText };
  }
  return null;
}

function makeReference() {
  // Simple human-friendly short id: yyyymmdd-hhmmss-XXXX
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ref =
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}-` +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  return ref;
}

function formatDetails({
  message,
  stack,
  statusInfo,
  reference,
  now,
  url,
}: {
  message: string;
  stack?: string;
  statusInfo: { status: number; statusText?: string } | null;
  reference: string;
  now: string;
  url: string;
}) {
  const lines = [
    `Time: ${now}`,
    `Reference: ${reference}`,
    `URL: ${url}`,
    statusInfo ? `Status: ${statusInfo.status}${statusInfo.statusText ? ` (${statusInfo.statusText})` : ""}` : "",
    `Message: ${message}`,
    "",
    "Stack:",
    stack || "No stack trace available.",
  ].filter(Boolean);
  return lines.join("\n");
}

function makeMailto({ subject, body }: { subject: string; body: string }) {
  const to = ""; // put your support email here, e.g., "support@example.com"
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${to}?${params.toString()}`;
}

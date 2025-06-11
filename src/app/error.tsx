// src/app/error.tsx

"use client";

import { captureException } from "@sentry/nextjs";
import React from "react";

export type ErrorProps = {
  error: Error;
  reset?: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  // Log error to console and Sentry
  React.useEffect(() => {
    console.error(error);
    captureException(error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      padding: "1rem",
      textAlign: "center"
    }}>
      <h1>Something went wrong</h1>
      <p>{error.message || "An unexpected error occurred."}</p>
      {reset && (
        <button
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
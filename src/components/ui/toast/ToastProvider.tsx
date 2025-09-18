"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#111111",
          color: "#ffffff",
          border: "1px solid #2a2a2a",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#111111" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#111111" },
        },
      }}
      containerStyle={{ zIndex: 9999 }}
      reverseOrder={false}
    />
  );
}

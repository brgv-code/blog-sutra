"use client";

import toastBase, { ToastOptions } from "react-hot-toast";

const base: ToastOptions = { duration: 4000 };

export const toast = {
  success: (message: string, opts?: ToastOptions) =>
    toastBase.success(message, { ...base, ...opts }),
  error: (message: string, opts?: ToastOptions) =>
    toastBase.error(message, { ...base, ...opts }),
  loading: (message: string, opts?: ToastOptions) =>
    toastBase.loading(message, { ...base, ...opts }),
  info: (message: string, opts?: ToastOptions) =>
    toastBase(message, { ...base, ...opts }),
  custom: toastBase.custom,
  dismiss: toastBase.dismiss,
  promise: toastBase.promise,
};

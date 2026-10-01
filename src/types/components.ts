// ============================================================
// Shared component prop types
// ============================================================
import type { ReactNode } from "react";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface WithId {
  id: string;
}
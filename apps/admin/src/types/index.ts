import type { ReactNode } from "react";

export * from "./category";
export * from "./course";

export interface DashboardLayoutProps {
  children: ReactNode;
}

export interface TopbarProps {
  className?: string;
}

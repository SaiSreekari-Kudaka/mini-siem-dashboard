import clsx from "clsx";

import { severityClass, statusClass } from "../utils/format";

export function SeverityBadge({ value }: { value?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide capitalize", severityClass(value))}>
      {value ?? "unknown"}
    </span>
  );
}

export function StatusBadge({ value }: { value?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide capitalize", statusClass(value))}>
      {value?.replace("_", " ") ?? "unknown"}
    </span>
  );
}


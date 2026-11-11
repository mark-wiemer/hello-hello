import type { Recurrence } from "../../utils/todo";

export type HiddenReason = "completed" | "snoozed";

export interface TodoTask {
  id: string;
  title: string;
  recurrence: Recurrence;
  position: number;
  hiddenUntil: string | null;
  hiddenReason: HiddenReason | null;
}

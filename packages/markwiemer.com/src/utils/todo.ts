export type RecurrenceUnit = "days" | "weeks" | "months";

export interface Recurrence {
  interval: number;
  unit: RecurrenceUnit;
}

export function isValidRecurrence(recurrence: Recurrence): boolean {
  return (
    Number.isInteger(recurrence.interval) &&
    recurrence.interval >= 1 &&
    recurrence.interval <= 99 &&
    ["days", "weeks", "months"].includes(recurrence.unit)
  );
}

export function formatRecurrence(recurrence: Recurrence): string {
  if (recurrence.interval === 1) {
    return {
      days: "Daily",
      weeks: "Weekly",
      months: "Monthly",
    }[recurrence.unit];
  }

  return `Every ${recurrence.interval} ${recurrence.unit}`;
}

export function getCompletionDueDate(completedAt: Date, recurrence: Recurrence): Date {
  if (!isValidRecurrence(recurrence)) {
    throw new RangeError("Recurrence must be between 1 and 99 days, weeks, or months.");
  }

  const dueDate = new Date(completedAt);

  if (recurrence.unit === "days") {
    dueDate.setDate(dueDate.getDate() + recurrence.interval);
  } else if (recurrence.unit === "weeks") {
    dueDate.setDate(dueDate.getDate() + recurrence.interval * 7);
  } else {
    const completionDay = dueDate.getDate();
    dueDate.setDate(1);
    dueDate.setMonth(dueDate.getMonth() + recurrence.interval);
    const lastDayOfMonth = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth() + 1,
      0,
    ).getDate();
    dueDate.setDate(completionDay >= 29 ? 28 : Math.min(completionDay, lastDayOfMonth));
  }

  dueDate.setHours(0, 0, 0, 0);
  return dueDate;
}

export function getSnoozeDueDate(snoozedAt: Date): Date {
  return new Date(
    snoozedAt.getFullYear(),
    snoozedAt.getMonth(),
    snoozedAt.getDate() + 1,
  );
}

export function getNextLocalDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

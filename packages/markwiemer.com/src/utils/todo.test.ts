import { describe, expect, it } from "vitest";
import {
  formatRecurrence,
  getCompletionDueDate,
  getNextLocalDay,
  getSnoozeDueDate,
  isValidRecurrence,
} from "./todo";

describe("todo recurrence", () => {
  it("uses concise names for one-unit recurrence and preserves plural intervals", () => {
    expect(formatRecurrence({ interval: 1, unit: "days" })).toBe("Daily");
    expect(formatRecurrence({ interval: 1, unit: "weeks" })).toBe("Weekly");
    expect(formatRecurrence({ interval: 1, unit: "months" })).toBe("Monthly");
    expect(formatRecurrence({ interval: 2, unit: "days" })).toBe("Every 2 days");
    expect(formatRecurrence({ interval: 2, unit: "weeks" })).toBe("Every 2 weeks");
    expect(formatRecurrence({ interval: 2, unit: "months" })).toBe("Every 2 months");
  });

  it("accepts intervals from 1 through 99", () => {
    expect(isValidRecurrence({ interval: 1, unit: "days" })).toBe(true);
    expect(isValidRecurrence({ interval: 99, unit: "months" })).toBe(true);
    expect(isValidRecurrence({ interval: 0, unit: "weeks" })).toBe(false);
    expect(isValidRecurrence({ interval: 100, unit: "weeks" })).toBe(false);
    expect(isValidRecurrence({ interval: 1.5, unit: "days" })).toBe(false);
  });

  it("makes day and week recurrence dates ready at local midnight", () => {
    const completedAt = new Date(2026, 0, 5, 14, 30);
    const dueInOneDay = getCompletionDueDate(completedAt, {
      interval: 1,
      unit: "days",
    });
    const dueInOneWeek = getCompletionDueDate(completedAt, {
      interval: 1,
      unit: "weeks",
    });

    expect(dueInOneDay.getTime()).toBe(new Date(2026, 0, 6).getTime());
    expect(dueInOneWeek.getTime()).toBe(new Date(2026, 0, 12).getTime());
  });

  it("uses the matching date next month for days 1 through 28", () => {
    const completedAt = new Date(2026, 0, 15, 9);
    const dueDate = getCompletionDueDate(completedAt, {
      interval: 1,
      unit: "months",
    });

    expect(dueDate.getTime()).toBe(new Date(2026, 1, 15).getTime());
  });

  it("uses the 28th of the target month for completion dates 29 through 31", () => {
    for (const day of [29, 30, 31]) {
      const completedAt = new Date(2026, 0, day, 9);
      const dueDate = getCompletionDueDate(completedAt, {
        interval: 1,
        unit: "months",
      });

      expect(dueDate.getTime()).toBe(new Date(2026, 1, 28).getTime());
    }
  });

  it("snoozes until midnight at the start of the next local day", () => {
    const snoozedAt = new Date(2026, 0, 5, 23, 45);
    const dueDate = getSnoozeDueDate(snoozedAt);

    expect(dueDate.getTime()).toBe(new Date(2026, 0, 6).getTime());
  });

  it("advances a simulated date by one local calendar day", () => {
    const currentDate = new Date(2026, 0, 31, 12, 30);
    const nextDate = getNextLocalDay(currentDate);

    expect(nextDate.getTime()).toBe(new Date(2026, 1, 1, 12, 30).getTime());
    expect(currentDate.getTime()).toBe(new Date(2026, 0, 31, 12, 30).getTime());
  });

  it("rejects invalid recurrence values when calculating a due date", () => {
    expect(() =>
      getCompletionDueDate(new Date(2026, 0, 1), { interval: 100, unit: "days" }),
    ).toThrow(RangeError);
  });
});

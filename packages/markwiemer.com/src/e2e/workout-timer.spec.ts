import { test, expect } from "@playwright/test";

test.describe("workout timer", () => {
  test.describe.configure({ timeout: 10000 });

  test.beforeEach(async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(() => {
      const cues: string[] = [];
      window.localStorage.setItem("__spokenWorkoutCues", JSON.stringify(cues));
      window.localStorage.removeItem("__copiedWorkoutUrl");
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          cancel: () => {},
          speak: (utterance: SpeechSynthesisUtterance) => {
            cues.push(utterance.text);
            window.localStorage.setItem("__spokenWorkoutCues", JSON.stringify(cues));
          },
        },
      });
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            window.localStorage.setItem("__copiedWorkoutUrl", text);
          },
        },
      });
    });
    await page.goto("/misc/");
  });

  test("runs prep, work, rest, and work with spoken countdowns", async ({ page }) => {
    await page.getByLabel("Reps", { exact: true }).fill("2");
    await page.getByLabel("Time per rep (MM:SS)", { exact: true }).fill("00:03");
    await page.getByLabel("Prep time (MM:SS)", { exact: true }).fill("00:03");
    await page.getByLabel("Rest between reps (MM:SS)", { exact: true }).fill("00:03");
    await page.getByRole("button", { name: "Start workout" }).click();

    const phase = page.locator("#workout-phase");
    const clock = page.locator("#workout-clock");
    await expect(phase).toHaveText("Prep");
    await expect(clock).toHaveText("00:03");

    await page.clock.runFor(3000);
    await expect(phase).toHaveText("Work");
    await expect(page.locator("#workout-repetition")).toHaveText("Work, rep 1 of 2.");

    await page.clock.runFor(3000);
    await expect(phase).toHaveText("Rest");
    await expect(page.locator("#workout-repetition")).toHaveText("Rest between reps 1 and 2.");

    await page.clock.runFor(3000);
    await expect(phase).toHaveText("Work");
    await expect(page.locator("#workout-repetition")).toHaveText("Work, rep 2 of 2.");

    await page.clock.runFor(3000);
    await expect(phase).toHaveText("Workout done");
    await expect(clock).toHaveText("00:00");
    await expect(page.locator("#workout-repetition")).toHaveText("Completed 2 reps.");

    const cues = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("__spokenWorkoutCues") ?? "[]") as string[],
    );
    expect(cues).toEqual([
      "3",
      "2",
      "1",
      "work, 3",
      "2",
      "1",
      "rest, 3",
      "2",
      "1",
      "work, 3",
      "2",
      "1",
      "workout done",
    ]);
  });

  test("starts with work when prep and setup are skipped", async ({ page }) => {
    await page.getByLabel("Reps", { exact: true }).fill("1");
    await page.getByLabel("Time per rep (MM:SS)", { exact: true }).fill("00:04");
    await page.getByLabel("Prep time (MM:SS)", { exact: true }).fill("00:00");
    await page.getByLabel("Rest between reps (MM:SS)", { exact: true }).fill("00:00");
    await page.getByRole("button", { name: "Start workout" }).click();

    await expect(page.locator("#workout-phase")).toHaveText("Work");
    await expect(page.locator("#workout-clock")).toHaveText("00:04");
    await page.clock.runFor(4000);
    await expect(page.locator("#workout-phase")).toHaveText("Workout done");

    const cues = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("__spokenWorkoutCues") ?? "[]") as string[],
    );
    expect(cues).toEqual(["work", "3", "2", "1", "workout done"]);
  });

  test("pause freezes the clock and resume continues it", async ({ page }) => {
    await page.getByLabel("Prep time (MM:SS)", { exact: true }).fill("00:10");
    await page.getByRole("button", { name: "Start workout" }).click();
    const progress = page.getByRole("progressbar");
    await page.clock.runFor(2000);
    await expect(page.locator("#workout-clock")).toHaveText("00:08");
    expect(Number(await progress.getAttribute("aria-valuenow"))).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Pause" }).click();
    const pausedProgress = await progress.getAttribute("aria-valuenow");
    await page.clock.runFor(5000);
    await expect(page.locator("#workout-clock")).toHaveText("00:08");
    await expect(progress).toHaveAttribute("aria-valuenow", pausedProgress ?? "");

    await page.getByRole("button", { name: "Resume" }).click();
    await page.clock.runFor(8000);
    await expect(page.locator("#workout-phase")).toHaveText("Work");
  });

  test("reset returns the timer to ready and keeps the selected settings", async ({ page }) => {
    const reps = page.getByLabel("Reps", { exact: true });
    await reps.fill("3");
    await page.getByRole("button", { name: "Start workout" }).click();
    await page.getByRole("button", { name: "Reset" }).click();

    await expect(page.locator("#workout-phase")).toHaveText("Ready");
    await expect(page.locator("#workout-clock")).toHaveText("00:00");
    await expect(reps).toBeEnabled();
    await expect(reps).toHaveValue("3");
  });

  test("counts down from one or two seconds", async ({ page }) => {
    await page.getByLabel("Reps", { exact: true }).fill("2");
    await page.getByLabel("Time per rep (MM:SS)", { exact: true }).fill("00:01");
    await page.getByLabel("Prep time (MM:SS)", { exact: true }).fill("00:02");
    await page.getByLabel("Rest between reps (MM:SS)", { exact: true }).fill("00:02");
    await page.getByRole("button", { name: "Start workout" }).click();

    await expect(page.locator("#workout-phase")).toHaveText("Prep");
    await expect(page.locator("#workout-countdown")).toHaveText("2");
    await page.clock.runFor(1000);
    await expect(page.locator("#workout-countdown")).toHaveText("1");
    await page.clock.runFor(1000);
    await expect(page.locator("#workout-phase")).toHaveText("Work");
    await expect(page.locator("#workout-countdown")).toHaveText("1");
    await page.clock.runFor(1000);
    await expect(page.locator("#workout-phase")).toHaveText("Rest");
    await expect(page.locator("#workout-countdown")).toHaveText("2");
    await page.clock.runFor(2000);
    await expect(page.locator("#workout-phase")).toHaveText("Work");
    await expect(page.locator("#workout-countdown")).toHaveText("1");
    await page.clock.runFor(1000);
    await expect(page.locator("#workout-phase")).toHaveText("Workout done");

    const cues = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("__spokenWorkoutCues") ?? "[]") as string[],
    );
    expect(cues).toEqual([
      "2",
      "1",
      "work, 1",
      "rest, 2",
      "1",
      "work, 1",
      "workout done",
    ]);
  });

  test("the rep stepper has large, bounded controls", async ({ page }) => {
    const reps = page.getByLabel("Reps", { exact: true });
    const increase = page.getByRole("button", { name: "Increase reps" });
    const decrease = page.getByRole("button", { name: "Decrease reps" });

    await expect(reps).toHaveValue("18");
    await expect(page.getByLabel("Time per rep (MM:SS)", { exact: true })).toHaveValue("00:20");
    await expect(page.getByLabel("Prep time (MM:SS)", { exact: true })).toHaveValue("00:05");
    await expect(page.getByLabel("Rest between reps (MM:SS)", { exact: true })).toHaveValue(
      "00:05",
    );
    await increase.click();
    await expect(reps).toHaveValue("19");
    await decrease.click();
    await expect(reps).toHaveValue("18");

    const size = await increase.evaluate((button) => {
      const bounds = button.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    });
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);

    await reps.fill("1");
    await expect(decrease).toBeDisabled();
    await reps.fill("100");
    await expect(increase).toBeDisabled();
  });

  test("the work duration input stays snug against its label", async ({ page }) => {
    const getGeometry = (selector: string) =>
      page.locator(selector).evaluate((input: HTMLInputElement) => {
        const label = input.labels?.[0];
        if (!label) throw new Error("Duration input must have a label.");
        const inputBounds = input.getBoundingClientRect();
        const labelBounds = label.getBoundingClientRect();
        return {
          inputHeight: inputBounds.height,
          labelGap: inputBounds.top - labelBounds.bottom,
        };
      });

    const workGeometry = await getGeometry("#workout-work-duration");
    const prepGeometry = await getGeometry("#workout-prep-duration");
    expect(workGeometry.inputHeight).toBe(prepGeometry.inputHeight);
    expect(workGeometry.labelGap).toBeGreaterThanOrEqual(0);
    expect(workGeometry.labelGap).toBeLessThanOrEqual(4);
  });

  test("a URL restores the customized session settings", async ({ page }) => {
    await page.getByLabel("Reps", { exact: true }).fill("4");
    await page.getByLabel("Time per rep (MM:SS)", { exact: true }).fill("01:15");
    await page.getByLabel("Prep time (MM:SS)", { exact: true }).fill("00:05");
    await page.getByLabel("Rest between reps (MM:SS)", { exact: true }).fill("00:08");
    await page.getByLabel("Speak countdown and work/rest cues").uncheck();

    const savedUrl = new URL(await page.locator("#workout-settings-url").inputValue());
    expect(savedUrl.searchParams.get("reps")).toBe("4");
    expect(savedUrl.searchParams.get("work")).toBe("75");
    expect(savedUrl.searchParams.get("prep")).toBe("5");
    expect(savedUrl.searchParams.get("setup")).toBe("8");
    expect(savedUrl.searchParams.get("speech")).toBe("0");

    await page.getByRole("button", { name: "Copy URL" }).click();
    await expect(page.locator("#workout-share-status")).toHaveText(
      "URL copied. Bookmark it to save these settings.",
    );
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("__copiedWorkoutUrl")))
      .toBe(savedUrl.href);

    await page.goto(`${savedUrl.pathname}${savedUrl.search}`);
    await expect(page.getByLabel("Reps", { exact: true })).toHaveValue("4");
    await expect(page.getByLabel("Time per rep (MM:SS)", { exact: true })).toHaveValue("01:15");
    await expect(page.getByLabel("Prep time (MM:SS)", { exact: true })).toHaveValue("00:05");
    await expect(page.getByLabel("Rest between reps (MM:SS)", { exact: true })).toHaveValue(
      "00:08",
    );
    await expect(page.getByLabel("Speak countdown and work/rest cues")).not.toBeChecked();
  });
});

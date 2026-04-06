import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

function defineProjects(ci: boolean) {
  const projects: PlaywrightTestConfig["projects"] = [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@headed/,
    },
  ];

  if (!ci) {
    projects.push({
      name: "chromium-headed",
      use: { ...devices["Desktop Chrome"], headless: false },
      grep: /@headed/,
    });
  }
  return projects;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "../src/e2e",
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 3000,
  use: {
    locale: "en-US", // to test date formatting
    trace: "on-first-retry",
    baseURL: "http://localhost:8910",
  },
  projects: defineProjects(!!process.env.CI),
});

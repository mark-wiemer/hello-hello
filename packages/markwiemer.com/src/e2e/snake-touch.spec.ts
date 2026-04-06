import { test, expect } from "@playwright/test";

const boardSize = 32;
const snakeColor: [number, number, number] = [100, 149, 237]; // cornflowerblue

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

async function swipeOnCanvas(
  page: import("@playwright/test").Page,
  start: { x: number; y: number },
  end: { x: number; y: number },
): Promise<void> {
  await page.locator("canvas.gameCanvas").evaluate(
    (canvas, gesture) => {
      const makeTouch = (x: number, y: number) =>
        new Touch({
          identifier: 1,
          target: canvas,
          clientX: x,
          clientY: y,
          radiusX: 2,
          radiusY: 2,
          rotationAngle: 0,
          force: 1,
        });

      const startTouch = makeTouch(gesture.start.x, gesture.start.y);
      canvas.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          changedTouches: [startTouch],
          targetTouches: [startTouch],
          touches: [startTouch],
        }),
      );

      const endTouch = makeTouch(gesture.end.x, gesture.end.y);
      canvas.dispatchEvent(
        new TouchEvent("touchend", {
          bubbles: true,
          cancelable: true,
          changedTouches: [endTouch],
          targetTouches: [],
          touches: [],
        }),
      );
    },
    { start, end },
  );
}

async function getCellRgb(
  page: import("@playwright/test").Page,
  cell: { x: number; y: number },
): Promise<[number, number, number]> {
  return await page
    .locator("canvas.gameCanvas")
    .evaluate((canvas: HTMLCanvasElement, targetCell) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2d context missing");
      const cellSize = canvas.width / 32;
      const pixel = ctx.getImageData(
        Math.floor(targetCell.x * cellSize + cellSize / 2),
        Math.floor(targetCell.y * cellSize + cellSize / 2),
        1,
        1,
      ).data;
      return [pixel[0], pixel[1], pixel[2]] as [number, number, number];
    }, cell);
}

test("swiping right queues a right turn on mobile", async ({ page }) => {
  test.setTimeout(10_000);
  await page.goto("/games/snake/index.html");

  const canvasRect = await page.locator("canvas.gameCanvas").boundingBox();
  expect(canvasRect).not.toBeNull();
  if (!canvasRect) throw new Error("Canvas bounding box missing");

  const cellSize = canvasRect.width / boardSize;
  const start = {
    x: canvasRect.x + cellSize * 2,
    y: canvasRect.y + cellSize * 2,
  };
  const end = {
    x: start.x + Math.max(30, cellSize),
    y: start.y,
  };

  await swipeOnCanvas(page, start, end);

  // The game ticks every ~62.5ms; after one tick, right swipe should move head to (1,2).
  await expect
    .poll(async () => getCellRgb(page, { x: 1, y: 2 }), { timeout: 10_000 })
    .toEqual(snakeColor);

  // Old tail at (0,0) should have moved away after the tick.
  await expect
    .poll(async () => getCellRgb(page, { x: 0, y: 0 }), { timeout: 10_000 })
    .not.toEqual(snakeColor);
});

import { expect, test, type Page } from "@playwright/test";

interface ToneAudioEvent {
  type: string;
  parameter?: string;
  value?: number;
  frequency?: number;
}

interface ToneAudioHarness {
  events: ToneAudioEvent[];
}

interface WindowWithToneAudioHarness extends Window {
  __toneAudioHarness: ToneAudioHarness;
}

async function installAudioContextMock(page: Page): Promise<void> {
  await page.addInitScript(() => {
    type MockEvent = {
      type: string;
      parameter?: string;
      value?: number;
      frequency?: number;
    };

    const events: MockEvent[] = [];

    class MockAudioParam {
      private currentValue = 0;

      constructor(private readonly name: string) {}

      get value(): number {
        return this.currentValue;
      }

      set value(value: number) {
        this.currentValue = value;
        events.push({ type: "value", parameter: this.name, value });
      }
    }

    class MockGainNode {
      readonly gain: MockAudioParam;

      constructor(name: string) {
        this.gain = new MockAudioParam(name);
      }

      connect(): void {}
    }

    class MockOscillator {
      type: OscillatorType = "sine";
      readonly frequency = new MockAudioParam("frequency");

      connect(): void {}

      start(): void {
        events.push({ type: "start", frequency: this.frequency.value });
      }
    }

    class MockAudioContext {
      destination = {};
      state: AudioContextState = "suspended";

      createGain(): MockGainNode {
        return new MockGainNode("volume");
      }

      createOscillator(): MockOscillator {
        return new MockOscillator();
      }

      resume(): Promise<void> {
        this.state = "running";
        return Promise.resolve();
      }

      close(): Promise<void> {
        this.state = "closed";
        events.push({ type: "close" });
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: MockAudioContext,
    });
    Object.defineProperty(window, "__toneAudioHarness", {
      configurable: true,
      value: {
        events,
      },
    });
  });
}

async function getAudioEvents(page: Page): Promise<ToneAudioEvent[]> {
  return page.evaluate(
    () => (window as WindowWithToneAudioHarness).__toneAudioHarness.events,
  );
}

test("plays offline and stops or restarts the selected tone", async ({ page }) => {
  await installAudioContextMock(page);
  await page.goto("/misc");
  await page.context().setOffline(true);

  const widget = page.locator("#tone-widget");
  const pitchPreset = page.locator("#tone-pitch");
  const exactFrequency = page.locator("#tone-frequency-exact");
  const playStopButton = page.locator("#tone-play-stop");

  await expect(widget).not.toContainText(/network connection|sound-wave cycles per second/);
  await expect(page.locator("#tone-timer")).toHaveCount(0);
  await expect(page.locator("#tone-status")).toHaveCount(0);
  await expect(page.locator("#tone-error")).toBeHidden();
  await expect(page.locator("#tone-pitch-help")).not.toContainText("simple");
  await expect(page.locator("#tone-volume-help")).toHaveText(
    "Start with your device volume low, especially when using headphones.",
  );

  await expect(pitchPreset).toHaveValue("850");
  await pitchPreset.selectOption("4000");
  await expect(exactFrequency).toHaveValue("4000");
  await pitchPreset.selectOption("850");
  await page.locator("#tone-frequency-details summary").click();
  await exactFrequency.fill("14567");
  await expect(page.locator("#tone-frequency-value")).toHaveText("14,567 Hz");
  await expect(pitchPreset).toHaveValue("custom");
  await expect(exactFrequency).toHaveCSS("appearance", "textfield");

  await page.locator("#tone-volume").evaluate((input) => {
    const volume = input as HTMLInputElement;
    volume.value = "100";
    volume.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator("#tone-volume-value")).toHaveText("100%");

  await playStopButton.click();
  await expect(playStopButton).toHaveText("Stop tone");

  let events = await getAudioEvents(page);
  const volumeGain = events.find(
    (event) => event.type === "value" && event.parameter === "volume",
  );
  expect(volumeGain?.value).toBeCloseTo(0.1);
  expect(events).toContainEqual({ type: "start", frequency: 14567 });
  expect(events.some((event) => event.type === "ramp")).toBe(false);

  await playStopButton.click();
  await expect(playStopButton).toHaveText("Play tone");
  events = await getAudioEvents(page);
  expect(events).toContainEqual({ type: "close" });

  await playStopButton.click();
  await expect(playStopButton).toHaveText("Stop tone");
  events = await getAudioEvents(page);
  expect(events.filter((event) => event.type === "start")).toHaveLength(2);

  await playStopButton.click();
  await expect(playStopButton).toHaveText("Play tone");
  events = await getAudioEvents(page);
  expect(events.filter((event) => event.type === "close")).toHaveLength(2);
});

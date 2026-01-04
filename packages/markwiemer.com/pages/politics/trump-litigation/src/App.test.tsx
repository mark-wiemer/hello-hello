import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("Simple working test", () => {
    it("the title is visible", () => {
        render(<App />);
        expect(screen.getByRole("heading")).toHaveTextContent("Hello");
    });
});

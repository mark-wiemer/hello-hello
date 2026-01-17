// Helper functions for a browser game using JavaScript and an HTML canvas

//#region Canvas and drawing
/**
 * Gets the canvas and 2D context from the DOM
 * @returns {Result<{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}>}
 */
export function getDomElements() {
  const canvas = document.querySelector("canvas");
  if (canvas === null) {
    return { success: false, error: "Failed to get canvas" };
  }
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return { success: false, error: "Failed to get canvas context" };
  }
  return { success: true, value: { canvas, ctx } };
}

/**
 * Calc the desired width and height of a square tiled canvas
 * @param {number} windowWidth Inner width of window
 * @param {number} windowHeight Inner height of window
 * @param {number} relativeSize Fraction of window size to take up, from 0 to 1
 * @param {number} boardSize Number of cells per side of the game board (int)
 * @returns {number} Desired width and height of a square canvas, in pixels, with guarantees:
 * - is an integer
 * - takes up less than or exactly relative size of window
 * - divisible by boardSize
 */
export function calcCanvasSize(windowWidth, windowHeight, relativeSize, boardSize) {
  // console.debug(`getCanvasSize(${windowWidth}, ${windowHeight}, ${relativeSize}, ${boardSize})`);
  const rawSideLength = Math.min(windowWidth, windowHeight) * relativeSize;
  const roundedSideLength = Math.floor(rawSideLength / boardSize) * boardSize;
  // console.debug(`getCanvasSize returning ${roundedSideLength}`);
  return roundedSideLength;
}

/**
 * Set the canvas to a square with the given side length in pixels
 * @param {number} size
 * @param {HTMLCanvasElement} canvas
 */
export function setCanvasSize(size, canvas) {
  canvas.setAttribute("width", size);
  canvas.setAttribute("height", size);
}

/**
 *
 * @param {Vector2D} cell Cell coordinate to fill
 * @param {string} color CSS color string
 * @param {CanvasRenderingContext2D} ctx
 * @returns {void} But returns ctx.fillStyle to previous value
 */
export function fillCell(cell, color, cellSize, ctx) {
  const oldFillStyle = ctx.fillStyle;
  ctx.fillStyle = color;
  ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize, color);
  ctx.fillStyle = oldFillStyle;
}
//#endregion Canvas an drawing

//#region User input
/**
 * Convert keyboard key to direction vector
 * @param {string} key Key string, e.g. `w` or `ArrowUp`
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
 * @param {Directions} dirs
 * @returns {import("../game.js").Vector2D | undefined} Direction vector or undefined if key doesn't match
 */
export function keyToDir(key, dirs) {
  switch (key) {
    case "w":
    case "ArrowUp":
      return dirs.up;
    case "s":
    case "ArrowDown":
      return dirs.down;
    case "a":
    case "ArrowLeft":
      return dirs.left;
    case "d":
    case "ArrowRight":
      return dirs.right;
  }
  return undefined;
}
//#endregion User input

//#region General types
/**
 * @typedef {Object} FailResult
 * @property {false} success
 * @property {string} error message when not successful
 */
/**
 * @template T
 * @typedef {Object} SuccessResult
 * @property {true} success
 * @property {T} value
 */
/**
 * @template T
 * @typedef {FailResult|SuccessResult<T>} Result
 */
//#endregion General types

//#region Vectors
/**
 * @typedef {Object} Vector2D
 * @property {number} x Horizontal component, positive is to the right
 * @property {number} y Vertical component, positive is downward
 */
/**
 * Unit vectors in cardinal directions
 * @typedef {Object} Directions
 * @property {Vector2D} up Unit vector upward
 * @property {Vector2D} down Unit vector downward
 * @property {Vector2D} left Unit vector going left
 * @property {Vector2D} right Unit vector going right
 */

/**
 * @type {Directions}
 */
export const dirs = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Add two vectors
 * @param {import("../game.js").Vector2D} a First vector to add
 * @param {import("../game.js").Vector2D} b Second vector to add
 * @returns {import("../game.js").Vector2D} Sum of two vectors
 */
export function addVector2D(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Check if two vectors are equal
 * @param {import("../game.js").Vector2D} a First vector
 * @param {import("../game.js").Vector2D} b Second vector
 * @returns {boolean} True if vectors have same x and y components
 */
export function eqVector2D(a, b) {
  return a.x === b.x && a.y === b.y;
}

/**
 * Convert vector to string representation
 * @param {import("../game.js").Vector2D} v Vector to convert
 * @returns {string} String in format "(x, y)"
 */
export function strVector2D(v) {
  return `(${v.x}, ${v.y})`;
}
//#endregion Vectors

//#region Klona
/**
 * Copied from https://github.com/lukeed/klona, MIT licensed,
 * copyright Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 * @template T
 * @param {T} val Input to deep clone
 * @returns {T} Deep clone of input
 */
/*
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export function klona(val) {
  let k, out, tmp;

  if (Array.isArray(val)) {
    out = Array((k = val.length));
    while (k--) out[k] = (tmp = val[k]) && typeof tmp === "object" ? klona(tmp) : tmp;
    return out;
  }

  if (Object.prototype.toString.call(val) === "[object Object]") {
    out = {}; // null
    for (k in val) {
      if (k === "__proto__") {
        Object.defineProperty(out, k, {
          value: klona(val[k]),
          configurable: true,
          enumerable: true,
          writable: true,
        });
      } else {
        out[k] = (tmp = val[k]) && typeof tmp === "object" ? klona(tmp) : tmp;
      }
    }
    return out;
  }

  return val;
}
//#endregion Klona

import * as core from "../game.js";

main();

function main() {
    const getDomElementsResult = core.getDomElements();
    if (!getDomElementsResult.success) {
        console.error(getDomElementsResult.error);
        return -1;
    }
    const { canvas, ctx } = getDomElementsResult.value;
    /** Fraction of shorter side of screen to take up */
    // includes small margin for scroll window for now
    const relativeSize = 0.9;

    /** Number of cells per side */
    const boardSize = 8;
    const canvasSize = core.calcCanvasSize(
        window.innerWidth,
        window.innerHeight,
        relativeSize,
        boardSize,
    );
    core.setCanvasSize(canvasSize, canvas);
    const cellSize = canvasSize / boardSize;

    /**
     * @type {Directions}
     */
    const dirs = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
    };

    /** @type {GameState} */
    let state = calcInitialState(boardSize, cellSize, ctx, dirs);

    console.debug("Starting game with state:");
    console.debug(state);
    drawState(state);

    document.addEventListener("DOMContentLoaded", function () {
        document.addEventListener("keydown", (e) => (state = handleInput(e, dirs, state)));
        /** ticks per second. Game will rerender this frequently as well. */
        const tps = 60;
        state.interval = setInterval(
            () => (state = tick(core.klona(state))),
            Math.floor(1000.0 / tps),
        );
    });
}

/**
 * Modifies the game state according to the user input
 * - Escape quits the game, clearing state interval
 * - WASD or arrow keys moves the snake, pushing an entry to `snakeDirs`
 * @param {KeyboardEvent} e
 * @param {Directions} dirs
 * @param {GameState} state
 */
function handleInput(e, dirs, state) {
    const newState = core.klona(state);
    // console.debug("keydown", e);
    // Debug mode: tick then pause
    if (e.key === " ") {
        newState.paused = false;
        tick(newState);
        newState.paused = true;
        return newState;
    }
    // Change direction
    const newDir = core.keyToDir(e.key, dirs);
    if (newDir) {
        newState.carAcc = newDir;
        return newState;
    }
    // Pause and unpause
    if (e.key === "Escape") {
        // console.debug(`${newState.paused ? "Unpausing" : "Pausing"}`);
        newState.paused = !newState.paused;
        return newState;
    }
    if (e.key === "r") {
        return calcInitialState(state.boardSize, state.cellSize, state.ctx, dirs);
    }
    // console.debug(`Unused key pressed: '${e.key}'`);
    return newState;
}

/**
 * Calculate a starting game state
 * @param {number} boardSize Number of cells on each size of the board
 * @param {number} cellSize Size in pixels of each board cell
 * @param {CanvasRenderingContext2D} ctx Drawing context for the canvas
 * @returns {GameState} a starting game state
 */
function calcInitialState(boardSize, cellSize, ctx) {
    const boardCenter = Math.floor((boardSize * cellSize) / 2);
    /** @type {GameState} */
    const state = {
        boardSize,
        boardPxSize: boardSize * cellSize,
        carPos: { x: boardCenter, y: boardCenter },
        carVel: { x: 0, y: 0 },
        carAcc: { x: 0, y: 0 },
        cellSize,
        ctx,
    };
    return state;
}

/**
 * Core game loop
 * @param {GameState} state
 * @returns {GameState} modified state (impure)
 */
function tick(state) {
    state.carPos = core.addVector2D(state.carPos, state.carVel);
    state.carVel = core.addVector2D(state.carVel, state.carAcc);
    drawState(state);
    return state;
}

/**
 * Draws the car
 * @param {GameState} state
 */
function drawState(state) {
    // draw black background
    state.ctx.fillStyle = "black";
    state.ctx.fillRect(0, 0, state.cellSize * state.boardSize, state.cellSize * state.boardSize);
    // draw car
    state.ctx.fillStyle = "red";
    state.ctx.fillRect(state.carPos.x, state.carPos.y, 40, 40);
}

/**
 * Mono-object tracking game state. Could be a bunch of globals, but this is easier to track
 * @typedef {Object} GameState
 * @property {number} boardSize number of cells on each side of the board. Each cell holds one track piece.
 * @property {import("../game.js").Vector2D} boardPxSize width and height of board
 * @property {import("../game.js").Vector2D} carAcc acceleration of player's car, in pixels per tick^2
 * @property {import("../game.js").Vector2D} carPos center position of the player's car, in pixels from top left
 * @property {import("../game.js").Vector2D} carVel velocity of player's car, in pixels per tick
 * @property {number} cellSize side length, in pixels, of a game cell on the grid. Only for view
 * @property {CanvasRenderingContext2D} ctx Canvas context for drawing the game. Only for view
 * @property {NodeJS.Timeout} interval Tick interval, never cleared
 * @property {boolean} paused Whether the game is paused
 */

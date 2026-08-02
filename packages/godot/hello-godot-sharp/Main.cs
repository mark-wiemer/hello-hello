namespace HelloGodotMono;

using Godot;
using System.Collections.Generic;
using System.Linq;

public partial class Main : Node
{
	#region Globals
	[Export]
	public PackedScene SegmentScene;

	#region Game variables
	private int score = 0;
	private bool gameStarted = false;
	#endregion Game variables

	#region Grid variables
	/// <summary>
	/// Number of cells in each row and column of the grid
	/// </summary>
	private readonly int gridSize = 20;
	// Size of each cell in pixels
	private readonly int cellSize = 50;
	#endregion Grid variables

	#region Snake variables
	private List<Vector2> snakePos;
	private List<ColorRect> snakeRect;

	/// <summary>Whether the snake can turn this tick</summary>
	private bool canTurn;

	/// <summary>
	/// Direction in which the snake is currently moving.
	/// Starts as zero vector to allow game to start by moving in any direction.
	/// </summary>
	private Vector2 snakeDir = new(0, 0);
	private Vector2 startPos = new(9, 9);
	#endregion Snake variables

	#region Directions
	private Vector2 up = new(0, -1);
	private Vector2 down = new(0, 1);
	private Vector2 left = new(-1, 0);
	private Vector2 right = new(1, 0);
	#endregion Directions

	#endregion Globals

	/// <summary>
	/// Magic function called when node enters scene tree for the first time.
	/// Resets game.
	/// </summary>
	public override void _Ready()
	{
		ResetGame();
	}

	/// <summary>
	/// Resets score and regenerate initial snake.
	/// </summary>
	private void ResetGame()
	{
		score = 0;
		GetNode("HUD").GetNode<Label>("Score").Text = "Score: " + score;
		canTurn = true;
		GenerateSnake();
	}

	/// <summary>
	/// Generates a starting snake, facing up, at the starting pos.
	/// </summary>
	private void GenerateSnake()
	{
		snakePos = [];
		snakeRect = [];

		for (int i = 0; i < 3; i++)
		{
			AddSegment(startPos + new Vector2(0, i));
		}
	}

	/// <summary>
	/// Adds a segment to the snake at the given board position.
	/// </summary>
	/// <param name="boardPos"></param>
	private void AddSegment(Vector2 boardPos)
	{
		snakePos.Add(boardPos);
		ColorRect Segment = SegmentScene.Instantiate<ColorRect>();
		Segment.Position = ToWindowPos(boardPos);
		AddChild(Segment);
		snakeRect.Add(Segment);
	}

	/// <summary>
	/// Magic function called every frame. Polls for user input.
	/// </summary>
	/// <param name="delta">Elapsed time since previous frame</param>
	public override void _Process(double delta)
	{
		TryTurnSnake();
	}

	/// <summary>
	/// Handle turn input. Start game on successful turn.
	/// </summary>
	private void TryTurnSnake()
	{
		if (!canTurn) return;

		if (
			Input.IsActionJustPressed("moveLeft")
			&& !snakeDir.Equals(left)
			&& !snakeDir.Equals(right)
		)
		{
			snakeDir = left;
			canTurn = false;
		}
		if (
			Input.IsActionJustPressed("moveRight")
			&& !snakeDir.Equals(left)
			&& !snakeDir.Equals(right)
		)
		{
			snakeDir = right;
			canTurn = false;
		}
		if (
			Input.IsActionJustPressed("moveUp")
			&& !snakeDir.Equals(up)
			&& !snakeDir.Equals(down)
		)
		{
			snakeDir = up;
			canTurn = false;
		}
		if (
			Input.IsActionJustPressed("moveDown")
			&& !snakeDir.Equals(up)
			&& !snakeDir.Equals(down)
		)
		{
			snakeDir = down;
			canTurn = false;
		}

		if (!canTurn && !gameStarted)
		{
			StartGame();
		}
	}

	/// <summary>
	/// Start moving the snake.
	/// </summary>
	private void StartGame()
	{
		gameStarted = true;
		GetNode<Timer>("Timer").Start();
	}

	/// <summary>
	/// Magic function connected to Timer's timeout signal. Ticks the game.
	/// Moves the snake in its current direction.
	/// Allows snake to turn directions for next tick.
	/// </summary>
	private void OnTimerTimeout()
	{
		MoveSnake();
		canTurn = true;
	}

	/// <summary>
	/// Adjust snake's position based on its current direction.
	/// </summary>
	private void MoveSnake()
	{
		var oldHead = snakePos[0];
		var newHead = oldHead + snakeDir;
		snakePos = [.. snakePos.Prepend(newHead)];
		snakePos = snakePos[..^1];
		for (int i = 0; i < snakePos.Count; i++)
		{
			var pos = snakePos[i];
			snakeRect[i].Position = ToWindowPos(pos);
		}
	}

	/// <summary>
	/// Convert a board position to a window position
	/// </summary>
	/// <param name="boardPos">Position on the board</param>
	/// <returns>Position, in pixels from top-left of window</returns>
	private Vector2 ToWindowPos(Vector2 boardPos)
	{
		// add one cell height for HUD
		return (boardPos * cellSize) + new Vector2(0, cellSize);
	}
}

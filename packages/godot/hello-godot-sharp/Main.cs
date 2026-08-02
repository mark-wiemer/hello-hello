namespace HelloGodotMono;

using Godot;
using System.Collections.Generic;
using System.Linq;

public partial class Main : Node
{
	[Export]
	public PackedScene SegmentScene;

	// Game variables
	private int score = 0;
	private bool gameStarted = false;

	// Grid variables
	// Number of cells in each row and column of the grid
	private readonly int gridSize = 20;
	// Size of each cell in pixels
	private readonly int cellSize = 50;

	// Snake variables
	private List<Vector2> snakePos;
	private List<ColorRect> snakeRect;

	// Movement variables
	private Vector2 startPos = new(9, 9);
	private Vector2 up = new(0, -1);
	private Vector2 down = new(0, 1);
	private Vector2 left = new(-1, 0);
	private Vector2 right = new(1, 0);

	/// <summary>
	/// Direction in which the snake is currently moving.
	/// Starts as zero vector to allow game to start by moving in any direction.
	/// </summary>
	private Vector2 snakeDir = new(0, 0);

	/// <summary>Whether the snake can turn this tick</summary>
	private bool canTurn;

	// Called when the node enters the scene tree for the first time.
	public override void _Ready()
	{
		NewGame();
	}

	private void NewGame()
	{
		score = 0;
		GetNode("HUD").GetNode<Label>("Score").Text = "Score: " + score;
		canTurn = true;
		GenerateSnake();
	}

	private void GenerateSnake()
	{
		snakePos = [];
		snakeRect = [];

		for (int i = 0; i < 3; i++)
		{
			AddSegment(startPos + new Vector2(0, i));
		}
	}

	private void AddSegment(Vector2 pos)
	{
		snakePos.Add(pos);
		ColorRect Segment = SegmentScene.Instantiate<ColorRect>();
		// plus one cell height for score panel
		Segment.Position = ToGamePos(pos);
		AddChild(Segment);
		snakeRect.Add(Segment);
	}

	/// <summary>
	/// Called every frame. Polls for user input.
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

	private void MoveSnake()
	{
		var oldHead = snakePos[0];
		var newHead = oldHead + snakeDir;
		snakePos = [.. snakePos.Prepend(newHead)];
		snakePos = snakePos[..^1];
		for (int i = 0; i < snakePos.Count; i++)
		{
			var pos = snakePos[i];
			snakeRect[i].Position = ToGamePos(pos);
		}
	}

	private Vector2 ToGamePos(Vector2 pos)
	{
		return (pos * cellSize) + new Vector2(0, cellSize);
	}
}

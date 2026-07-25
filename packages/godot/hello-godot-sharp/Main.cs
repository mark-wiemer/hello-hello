using Godot;
using System;
using System.Collections.Generic;

public partial class Main : Node
{
	[Export]
	public PackedScene SegmentScene;
	
	// Game variables
	private int _score = 0;
	private bool _gameStarted = false;
	
	// Grid variables
	// Number of cells in each row and column of the grid
	private readonly int _gridSize = 20;
	// Size of each cell in pixels
	private readonly int _cellSize = 50;
	
	// Snake variables
	private List<Vector2> _oldData;
	private List<Vector2> _newData;
	private List<ColorRect> _snake; 
	
	// Movement variables
	private Vector2 _startPos = new Vector2(9, 9);
	private Vector2 _up = new Vector2(0, -1);
	private Vector2 _down = new Vector2(0, 1);
	private Vector2 _left = new Vector2(-1, 0);
	private Vector2 _right = new Vector2(1, 0);
	private Vector2 _direction;
	private bool _canMove;
	
	// Called when the node enters the scene tree for the first time.
	public override void _Ready()
	{
		NewGame();
	}

	private void NewGame() {
		_score = 10;
		GetNode("HUD").GetNode<Label>("Score").Text = "Score: " + _score;
		_direction = _up;
		_canMove = true;
		GenerateSnake();
	}

	private void GenerateSnake() {
		_oldData = new();
		_newData = new();
		_snake = new();

		for (int i = 0; i < 3; i++) {
			AddSegment(_startPos + new Vector2(0, i));
		}
	}

	private void AddSegment(Vector2 pos) {
		_newData.Add(pos);
		ColorRect Segment = SegmentScene.Instantiate<ColorRect>();
		// plus room at top for score panel
		Segment.Position = (pos * _cellSize) + new Vector2(0, _cellSize);
		AddChild(Segment);
		_snake.Add(Segment);
	}

	// Called every frame. 'delta' is the elapsed time since the previous frame.
	public override void _Process(double delta)
	{
	}
}

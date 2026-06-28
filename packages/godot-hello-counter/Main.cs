using Godot;

public partial class Main : Control
{
    private int _count = 0;
    private Label _countLabel = null!;

    public override void _Ready()
    {
        _countLabel = GetNode<Label>("VBoxContainer/CountLabel");
        GetNode<Button>("VBoxContainer/Button").Pressed += OnButtonPressed;
    }

    private void OnButtonPressed()
    {
        _count++;
        _countLabel.Text = $"Count: {_count}";
    }
}

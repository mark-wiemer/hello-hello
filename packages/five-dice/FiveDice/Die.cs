namespace FiveDice;

/// <summary>
/// A game die.
/// </summary>
class Die
{
    private int value;

    public int Value
    {
        get => value;
        set => this.value = value >= 1 && value <= 6 ? value : throw new ArgumentOutOfRangeException(nameof(value), "Die value must be between 1 and 6.");
    }
}
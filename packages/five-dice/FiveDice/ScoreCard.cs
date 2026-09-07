namespace FiveDice;

/// <summary>
/// A Five Dice score card for a single player.
/// Incomplete fields are null.
/// Zeros are scratched-out fields.
/// Self-manages via "add score" methods.
/// </summary>
class ScoreCard
{
    public int? Ones { get; }
    public int? Twos { get; }
    public int? Threes { get; }
    public int? Fours { get; }
    public int? Fives { get; }
    public int? Sixes { get; }

    public int? ThreeOfAKind { get; }
    public int? FourOfAKind { get; }
    public int? FullHouse { get; }
    public int? SmallStraight { get; }
    public int? LargeStraight { get; }
    public int? Yahtzee { get; }
    public int? Chance { get; }

    public int UpperSectionTotal =>
        (Ones ?? 0)
        + (Twos ?? 0)
        + (Threes ?? 0)
        + (Fours ?? 0)
        + (Fives ?? 0)
        + (Sixes ?? 0);

    public int UpperSectionBonus => UpperSectionTotal >= 63 ? 35 : 0;

    public int LowerSectionTotal =>
        (ThreeOfAKind ?? 0)
        + (FourOfAKind ?? 0)
        + (FullHouse ?? 0)
        + (SmallStraight ?? 0)
        + (LargeStraight ?? 0)
        + (Yahtzee ?? 0)
        + (Chance ?? 0);

    public int GrandTotal => UpperSectionTotal + UpperSectionBonus + LowerSectionTotal;

    public bool IsComplete =>
        Ones.HasValue
        && Twos.HasValue
        && Threes.HasValue
        && Fours.HasValue
        && Fives.HasValue
        && Sixes.HasValue
        && ThreeOfAKind.HasValue
        && FourOfAKind.HasValue
        && FullHouse.HasValue
        && SmallStraight.HasValue
        && LargeStraight.HasValue
        && Yahtzee.HasValue
        && Chance.HasValue;
}
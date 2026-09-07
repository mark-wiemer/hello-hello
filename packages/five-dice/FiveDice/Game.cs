namespace FiveDice;

public class Game
{
    /// <returns>Five randomly-rolled die</returns>
    internal static void RollTurn()
    {
        var dice = Roll.RollDice(6, 5);

        Messages.ShowDice(dice);
    }
}
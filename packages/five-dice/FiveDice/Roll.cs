namespace FiveDice;

/// <summary>
/// Various functions for rolling a die
/// </summary>
public class Roll
{
    /// <param name="sides">The number of sides on the standard die</param>
    /// <returns>a random number from 1 to `sides`</returns>
    public static int RollDie(int sides)
    {
        return new Random().Next(1, sides + 1);
    }
}
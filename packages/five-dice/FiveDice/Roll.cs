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

    public static int[] RollDice(int sides, int count)
    {
        if (sides <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(sides), "The number of sides must be greater than zero.");
        }

        if (count <= 0)
        {
            return [];
        }

        int[] results = new int[count];
        for (int i = 0; i < count; i++)
        {
            results[i] = RollDie(sides);
        }

        return results;
    }
}
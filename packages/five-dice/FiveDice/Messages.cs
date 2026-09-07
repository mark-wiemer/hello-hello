namespace FiveDice;

public class Messages
{
    public static void ShowWelcome()
    {
        Console.WriteLine("Welcome to Five Dice!");
    }

    public static void ShowFarewell()
    {
        Console.WriteLine("Ending game, have a good day!");
    }

    public static void ShowMenu()
    {
        Console.WriteLine("Menu");
        Console.WriteLine("[r]oll");
        Console.WriteLine("[q]uit");
        Console.Write("Your input: ");
    }

    public static void ShowUnknownCommand()
    {
        Console.WriteLine("Unknown command received, please try again.");
    }

    /// <summary>
    /// Prints the Unicode version of the values.
    /// U+2680 to U+2685, "Die Face-N" where N is the int.
    /// </summary>
    /// <param name="dice">Numbers from 1-6 inclusive</param>
    public static void ShowDice(int[] dice)
    {
        foreach (var die in dice)
        {
            if (die < 1 || die > 6)
            {
                throw new ArgumentOutOfRangeException(nameof(dice), "Die values must be between 1 and 6 inclusive.");
            }

            Console.Write((char)(0x2680 + die - 1));
            Console.Write(' ');
        }

        Console.WriteLine();
    }

    internal static void ShowScoreCard(ScoreCard card = null)
    {
        card ??= new ScoreCard();

        foreach (var property in typeof(ScoreCard).GetProperties())
        {
            if (property.Name == "IsComplete") continue;
            var value = property.GetValue(card);
            Console.WriteLine($"{property.Name}: [{value ?? " "}]");
            if (property.Name == "Sixes") Console.WriteLine();
            if (property.Name == "Chance") Console.WriteLine();
            if (property.Name == "GrandTotal") Console.WriteLine();
        }
    }
}
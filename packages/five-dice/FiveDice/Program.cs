namespace FiveDice;

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello");

        var rand = new Random();
        var min = 1;
        var max = 6;
        var result = rand.Next(min, max + 1);

        Console.WriteLine(result);
    }
}

namespace FiveDice;

public class Program
{
    public static void Main()
    {
        Messages.ShowWelcome();
        Messages.ShowScoreCard();
        while (true)
        {
            Messages.ShowMenu();
            var userInput = Console.ReadLine();
            var command = Input.ParseInput(userInput);
            var result = Input.HandleCommand(command);
            if (result == Code.Quit)
            {
                break;
            }
        }
        Messages.ShowFarewell();
    }
}

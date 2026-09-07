namespace FiveDice;

internal enum Command
{
    Unknown = 0,
    Quit = 1,
    Roll = 2
}

internal enum Code
{
    Continue = 0,
    Quit = 2,
}

class Input
{
    public static Command ParseInput(string userInput)
    {
        if (userInput.StartsWith('q')) return Command.Quit;
        if (userInput.StartsWith('r')) return Command.Roll;
        return Command.Unknown;
    }

    public static Code HandleCommand(Command command)
    {
        switch (command)
        {
            case Command.Quit:
                return Code.Quit;
            case Command.Roll:
                Game.RollTurn();
                return Code.Continue;
            default:
                Messages.ShowUnknownCommand();
                return Code.Continue;
        }
    }
}
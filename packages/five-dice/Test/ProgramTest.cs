using FiveDice;

namespace Test;

public class ProgramTest
{
    [Fact]
    public void Runs()
    {
        Console.WriteLine("Test: Begin Program.Main()");
        Program.Main();
        Console.WriteLine("Test: End   Program.Main()");
    }
}

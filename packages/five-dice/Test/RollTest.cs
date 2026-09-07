using FiveDice;

namespace Test;

public class RollTest
{
    [Fact]
    public void RollDie_FullRange_NotOutside()
    {
        var sides = 20;
        var trials = sides * 50;
        List<int> results = [];
        for (int i = 0; i < trials; i++)
        {
            results = [.. results, Roll.RollDie(sides)];
        }
        for (int i = 1; i <= sides; i++)
        {
            Assert.True(results.IndexOf(i) >= 0, i.ToString());
        }
        results.RemoveAll(r => 1 <= r && r <= sides); // nothing outside the range
        Assert.Empty(results);
    }
}

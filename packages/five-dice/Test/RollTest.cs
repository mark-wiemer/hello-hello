using FiveDice;

namespace Test;

public class RollTest
{
    [Fact]
    public void RollDie_3Sides()
    {
        var sides = 3;
        List<int> results = [];
        for (int i = 0; i < sides * 20; i++)
        {
            results = results.Append(Roll.RollDie(sides)).ToList();
        }
        for (int i = 1; i <= sides; i++)
        {
            Assert.True(results.IndexOf(i) >= 0, i.ToString());
        }
        results.RemoveAll(r => 1 <= r && r <= sides);
        Assert.True(results.Count == 0);
    }
}

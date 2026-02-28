# Hello .NET

This includes C#, ASP.NET, .NET SDK 10, everything :)

[Installation steps for Linux Mint](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet10&pivots=os-linux-ubuntu-2404):

```sh
sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-10.0
```

## Roslyn

The [`roslyn` folder](./roslyn/README.md) is a submodule of [Roslyn](https://github.com/mark-wiemer/roslyn), the .NET compiler platform. I primarily develop this on Windows to gain comfort working in [Visual Studio](../new-machine/windows.md#visual-studio).

### Getting started

[Windows docs](./roslyn/docs/contributing/Building,%20Debugging,%20and%20Testing%20on%20Windows.md)

```sh
powershell ./Restore.cmd
powershell ./Build.cmd
powershell ./Test.cmd
```

Right now, many tests are failing, and it took 2042 seconds to run the tests on my local machine on Windows. So I'll have to dig in!

### Improvements

- Links in readme should to go local files, not GitHub main branch

# Hello .NET

This includes C#, ASP.NET, .NET SDK 10, everything :)

.NET has three languages: C#, F#, and Visual Basic. Virtually all of my .NET work is in C#.

## General resources

[Documentation](https://learn.microsoft.com/en-us/dotnet/)

- [CLI overview](https://learn.microsoft.com/en-us/dotnet/core/tools/)
- [Define consistent coding styles with EditorConfig](https://learn.microsoft.com/en-us/visualstudio/ide/create-portable-custom-editor-options?view=visualstudio)
- [Tools and diagnostics documentation](https://learn.microsoft.com/en-us/dotnet/navigate/tools-diagnostics/)

## Getting started

[Installation steps for Linux Mint](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet10&pivots=os-linux-ubuntu-2404):

```sh
sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-10.0
```

For Windows, you can simply install [Visual Studio](../new-machine/windows.md#visual-studio).

## Console

The [`console` folder](./console/readme.md) is a minimal project to learn the fundamentals of .NET.

<!-- this is linked from elsewhere, don't rename without updating links -->

## Roslyn

The [`roslyn` folder](./roslyn/README.md) is a submodule of [Roslyn](https://github.com/mark-wiemer/roslyn), AKA the .NET Compiler Platform SDK. I primarily develop this on Windows to gain comfort working in [Visual Studio](../new-machine/windows.md#visual-studio). The [Roslyn docs](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/) guide developers in using (not developing) Roslyn in their projects.

### Using Roslyn

Roslyn is mostly a behind-the-scenes project that runs when you compile .NET code. As [the Roslyn docs](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/) put it:

> This is the core mission of the Roslyn APIs: opening up the opaque boxes and allowing tools and end users to share in the wealth of information compilers have about our code.

### Contributing

#### Getting started

[Windows docs](./roslyn/docs/contributing/Building,%20Debugging,%20and%20Testing%20on%20Windows.md)

```sh
powershell ./Restore.cmd
powershell ./Build.cmd
powershell ./Test.cmd
```

Right now, many tests are failing, and it took 2042 seconds (34 minutes!) to run the tests on my local machine on Windows. So I'll have to dig in!

### Notes

``Filename`2+Test.cs`` is an intentional pattern:

- `` `2`` indicates two type parameters in the outermost class
- `+Test` indicates it has a nested test file

Note that these are also partial class definitions so the same class is defined in two files. I don't know enough to understand the benefits of this, but off the bat I don't like it. I'm going to keep it for now to avoid breaking things.

### Improvements

- Links in readme should to go local files, not GitHub main branch

## SemicolonPlacementAnalyzer (SCPA)

[SemicolonPlacementAnalyzer](./SemicolonPlacement/readme.md) is a minimal [Roslyn](#roslyn) analyzer.

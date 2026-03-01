# Semi-colon Placement Analyzer (SCPA)

The [.NET Compiler Platform SDK](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/), AKA Roslyn, allows developers to create custom "analyzers" that run when code is built or formatted. This is effectively a nice plugin system for exposing compiler information, and this is a sample project to build a single Roslyn analyzer. The goal of this analyzer is to better format weirdly-placed semi-colons, for example:

```cs
Console.WriteLine("")

;
```

After formatting according to this analyzer, the goal is to return:

```cs
Console.WriteLine("");
```

From what I can tell, this analyzer isn't available in .NET by default. I'm no expert!

## Getting started

- [Tutorial: Write your first analyzer and code fix](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/tutorials/how-to-write-csharp-analyzer-code-fix)

1. Open Visual Studio 2026 (yes this requires Visual Studio)
1. Create a new project with the "Analyzer with Code Fix (C#)" template
1. Place project and solution in the same folder
1. Use .NET Framework 4.8
1. Add the `.gitignore` file

(The project doesn't run quite yet)

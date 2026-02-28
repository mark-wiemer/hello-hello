# Hello .NET console app

Created with .NET SDK 10.0.103:

```sh
dotnet new console
```

## Getting started

```sh
dotnet run
```

Should print `Hello from .NET console app!` to stdout without opening a new window.

## Relevant commands

### Generate a `.editorconfig` file

```sh
dotnet new editorconfig
```

---

### Format the `.cs` files

```sh
dotnet format
```

Note that Roslyn is not as strict as CSharpier. You can check it works by ensuring that:

```cs
Console . WriteLine ("") ;
```

turns into:

```cs
Console . WriteLine ("") ;
```

However, it will not, for example, move semi-colons up lines of code:

```cs
// This doesn't get changed by `dotnet format`
Console.WriteLine("")
;
```

We can write custom Roslyn analyzers to handle this if we want.

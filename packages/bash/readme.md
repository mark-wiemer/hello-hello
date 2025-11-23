# Hello Bash

A cross-platform shell.
Double quotes always recommended for cross-platform compatibility.
See my new-machine repo for installation.
This [How-To Geek article on the difference between terminal, shell, and console](https://www.howtogeek.com/terminal-vs-command-line-vs-shell-vs-console/) also covers TTY (teletypewriter).

## Aliases

```sh
# Open the .bashrc file in VS Code
alias bashedit='code ~/.bashrc'
```

## Variables

```sh
# Print "Hello world, x is 2" to stdout (excluding quotes)
# No spaces allowed between var name, `=`, and var value
x=2
# Spaces allowed within quoted strings.
# Quotes are not part of var value.
y="Hello world"
echo $y, x is $x
```

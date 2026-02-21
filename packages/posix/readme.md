# Hello POSIX

Short for Portable Operating System Interface (the X apparently has no meaning),
POSIX is a set of standards for tools to work across operating systems,
like how [Bash](../bash/readme.md) works nearly the same in Windows and Linux distributions.

POSIX also defines the [Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html) and many [utilities](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap03.html) like `cd`. Bash aims to be compliant with POSIX.

- [POSIX - Wikipedia](https://en.wikipedia.org/wiki/POSIX)
  - Current [official names](https://pubs.opengroup.org/onlinepubs/9799919799/mindex.html):
    - POSIX.1-2024
    - IEEE Std 1003.1™-2024
    - The Open Group Standard Base Specifications, Issue 8
- [Shell and Utilities section of POSIX (official)](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/contents.html)
  - Bash aims to be compliant with this section, but also has a special `--posix` option to more closely align. See [Bash](../bash/readme.md) for more details.
  - This page also lists all built-in utilities, like `cd` and `mkdir`.
  - Volume: [XCU](https://pubs.opengroup.org/onlinepubs/9799919799/mindex.html) (utilities)

## Shell Command Language

Links are to official sources unless otherwise specified. Citations in code use the same numbering and name as in official sources.

[Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html)

Full name: Volume: XCU, Chapter 2: Shell Command Language

### Redirecting output

[2.7.2 Redirecting output](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html#tag_18_07_02)

```sh
# Print stdout to a file
# 2.7.2 Redirecting output
echo Hello > out.log
```

```sh
# Print stdout and stderr to the same file
# 2.7.6 Duplicating an Output File Descriptor
echo Hello > out.log 2>&1
```

### Pipelines

[2.9.2 Pipelines](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html#tag_19_09_02)

```sh
echo "Hello
world" | grep Hello
```

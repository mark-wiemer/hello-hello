# Hello jq

jq is a CLI JSON processor.

- [jq repo on GitHub](https://github.com/jqlang/jq)

```sh
# Print the contents of package.json, formatted, to stdout
jq . package.json
```

Set the top-level `author` prop to `Mark Wiemer` in package.json, updating the file itself.

```sh
jq '.author = "Mark Wiemer"'  package.json > tmp.json && mv tmp.json package.json
```

A [json_edit Shell function](../bash/readme.md#functions) simplifies this:

```sh
json_edit '.author = "Mark Wiemer"'
```

# Hello jq

jq is a CLI JSON processor.

- [jq repo on GitHub](https://github.com/jqlang/jq)

```sh
# Print the contents of package.json, formatted, to stdout
jq . package.json
```

```sh
jq '.author = "Mark Wiemer"'  package.json > tmp.json && mv tmp.json package.json
```

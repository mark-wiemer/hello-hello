# Hello mod.io

[mod.io](https://mod.io) is a site for hosting game mods. I'm currently using it for [my Melvor Idle mods](../melvor/readme.md).

## Search

```sh
curl "https://api.mod.io/v1/games?name_id=melvoridle&api_key=__TODO_API_KEY__"
```

## modiom

A CLI for mod.io, requires [Rust](../rust/readme.md)'s package manager, Cargo:

```sh
git clone https://github.com/nickelc/modiom.git
cargo install --path modiom
```

Uploading with modiom requires the numeric game ID, hence the search above

- [modiom repo](https://github.com/nickelc/modiom)

## Resources

- [docs.mod.io](https://docs.mod.io/)

# Hello Luanti

[Luanti](https://docs.luanti.org/) (formerly Minetest) has three parts: an open-source "boxel" game engine for making games like Minecraft, a distribution platform for creators, and an application for players.

[I've helped a lot with Luanti docs](https://markwiemer.com/luanti), and this space is both for:

- further improvements to docs
- Hello World projects for myself

Fortunately, I can translate the Hello World projects directly into further improvements to docs as well!

## doc-schema

Make the docs parsable for extensions, plugins, and content type transformations.

## luanti-ts-api

Handwritten TypeScript API for Luanti.
Paused in favor of [Make API docs parsable](https://github.com/luanti-org/docs.luanti.org/issues/296).

## sample-mod

A minimal hello world mod to learn about the current tooling for mods written in Lua.
[Enable the LuaLS addon](https://luals.github.io/wiki/addons/#addon-manager) for "Luanti" and "Luanti Full API".
Also consider using Luanti Tools.
You shouldn't see any yellow or red squiggles.

## void-game-ts

A very minimal game written in TypeScript alongside my handwritten TypeScript API.
Development slowed after I realized how annoying it would be to maintain an handwritten TypeScript API.
Ref [Make API docs parsable](https://github.com/luanti-org/docs.luanti.org/issues/296).

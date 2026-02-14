# Mocha issue 5078

https://github.com/mochajs/mocha/issues/5078

Basically unhandled errors print out help text and then "Error: null". However, this was first reported in December 2024 so it's 2+ years old and Mocha has significantly improved since then. That said, we'd still like to remove this possibility once and for all.

With this repro, the `runMocha` function immediately executes `throw null` in hopes to reproduce the worst-case behavior.

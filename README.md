# Lunar's PC Building Simulator Companion

[![Coverage Status](https://coveralls.io/repos/github/AlyxMoon/lunar-pc-build-sim-companion/badge.svg?branch=main)](https://coveralls.io/github/AlyxMoon/lunar-pc-build-sim-companion?branch=main)

This is a web-hosted companion app for PC Building Simulator. Intended to help look up parts, keep track of client projects, and plan out builds. It's a hobby project right now so I'm not spending too much time on documentation. If you have any questions or want to help you are welcome to reach out.


### Local development

Use Node 24 LTS and Yarn Classic 1.22.22 through Corepack:

```sh
corepack yarn@1.22.22 install --frozen-lockfile
corepack yarn@1.22.22 convert-raw-data
corepack yarn@1.22.22 serve
```

The converter still reads the CSV files in `scripts/convertRawData/data`. It runs
with Node 24's built-in TypeScript support and generates ignored JSON under
`src/assets/data`. Run it before building or checking types.

```sh
corepack yarn@1.22.22 build
corepack yarn@1.22.22 typecheck
corepack yarn@1.22.22 test:unit
corepack yarn@1.22.22 lint --no-fix
corepack yarn@1.22.22 preview
```

The production build writes `dist` with the base path
`/pc-build-sim-companion/`. Preview it at
`http://localhost:4173/pc-build-sim-companion/`.
The deployment command remains `yarn convert-raw-data && yarn build`.
Unit tests run once under Vitest and write LCOV coverage to `tests/coverage`.
The lint command checks TypeScript, Vue components, scripts and tool configs
with ESLint 9; pass `--fix` explicitly to apply fixes.
Set `VUE_APP_ENABLE_ANALYTICS=true` and `VUE_APP_ANALYTICS_CODE` at build time
to make analytics available. The tag-manager script is requested only after the
visitor enables analytics on Settings; the choice defaults to off and is saved
in local storage. Turning it off saves the choice and reloads the page to stop
the loaded scripts. Without both deployment settings the script is never loaded.
The app pushes `page_view` events to the tag manager's `dataLayer` for the current
page after opt-in and each successful route change, with `page_path`,
`page_location` and `page_title`. The container must handle this custom event
to forward views to Analytics; automatic page-view tracking should not duplicate
these events. Container configuration is managed outside this repository.

The TypeScript configuration keeps `useDefineForClassFields` disabled because
the models install reactive property accessors in their base constructor.
Vuex 4's declaration path is mapped explicitly because its package exports do
not expose those declarations to TypeScript's bundler resolution.

### Notes on validation rules
One goal I have is to check all possible errors that might happen when picking out parts for a build. These rules can be found in `src/lib/buildValidationRules`. The general naming convention I'm going with is to have it rule start with the part type and then state the rule. In the case of part compatibility, the part that holds the other part goes first (i.e. a CPU goes on a motherboard, so that check would be motherboardFitsCpu).

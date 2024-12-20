# Creative FE Devtools in the form of Chrome extension

- [How to start](./docs/intro.md)
- pnpm install
- develop this extension in Chrome: using dev mode and load dist folder

## Develop
```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Bump version

```bash
pnpm release # patch: 1.0.0 → 1.0.1
pnpm release:minor # minor: 1.0.0 → 1.1.0
pnpm release:major # major: 1.0.0 → 2.0.0
```

## Pack as zip

```bash
pnpm pack:zip
```

## Release a patch version after develop

```bash
# Equals to bump version + build + pack:zip
pnpm bundle:release-patch
```

## Dry bundle (without bump version)

```bash
# Equals to build + pack:zip
pnpm bundle:dry
```

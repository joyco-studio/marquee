# Templates folder

This folder is being targeted as a monorepo project. Create new test cases for your library here and install the the library as a workspace dependency.

## 📦 Installation example

To install the monorepo library `@joycostudio/generic` as a workspace dependency, run the following command from the root of the monorepo:

```bash
pnpm add @joycostudio/generic --filter ./templates/[your-template-project]
```

Replace `your-template-project` with the name of your specific template project directory.

## 🔍 Preview with Stackblitz
If you enabled the [🔍 PR Preview] with PKG.PR.NEW you should add the template flag in the `publish-any-commit.yml` Github workflow file.

```diff
- - run: pnpx pkg-pr-new publish --comment=update
+ - run: pnpx pkg-pr-new publish --comment=update --template templates/[your-template-project]
```

## ⚡️ Quickstart
```bash
pnpx create-react-router@latest ./templates/basic
```

Delete unused files:
```bash
rm ./templates/basic/.dockerignore ./templates/basic/Dockerfile ./templates/basic/README.md
```

Run the linter for the new template:
```bash
pnpm lint
```

Remember to add this to make changesets ignore this npm project for versioning and publishing.

```json
"private": true,
"changeset": {
  "ignore": true
}
```
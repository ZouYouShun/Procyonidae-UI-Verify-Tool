# Procyonidae UI Verify Tool

A tool for easy use with UI verify, like https://nimbusweb.me.

## Run app

```bash
npm start
```

## Features

1. [ ] screenshot
2. [ ] add comments on picture, status

   1. [ ] comment add comment block
   2. [ ] arrow(click animation)
   3. [ ] draw
   4. [ ] color picker
   5. [ ] shape(circle/square)
   6. [ ] clear all

3. [ ] manage comments
4. [ ] output comment and picture for easy to send to Jira
5. [ ] sync comment from Jira
6. [ ] screencasts

   1. [ ] record mic sound
   2. [ ] record tab sound
   3. [ ] record web cam

7. [ ] keyboard binding manage

## Tech solution

1. Electron app,
   1. Screenshot
   2. Select range
2. React for client app
   1. tool bar view
   2. manage view
3. Jira API

- `shift + cmd + x` to open `Manage view mode`
  - show panel from right hand side.
  - add record -> into `Screenshot mode`
  - view all record
  - select record
  - delete record
- `shift + cmd + s` to open `Screenshot mode`
  - directly into screenshot select range view
  - show tool bar
- right hand panel will have a list on issue like below

[export][sync][link][]

| image                | comment     | status                             | action         |
| -------------------- | ----------- | ---------------------------------- | -------------- |
| (image)[change file] | [TextField] | verified / wait / done / won't fix | [delete][move] |
|                      |             | verified / wait / done / won't fix |                |
|                      |             | verified / wait / done / won't fix |                |

There are also many [community plugins](https://nx.dev/community) you could add.

## Project structure

We follow the Nx workspace structure, easy to view project structure with [dependency graph](https://nx.dev/latest/angular/structure/dependency-graph)
https://github.com/trungk18/angular-spotify

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@procyonidae/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Nx workspace with react tutorials

https://egghead.io/lessons/javascript-create-a-new-empty-nx-workspace

## Nx Electron

nx g nx-electron:app procyonidae-electron --frontendProject=procyonidae

## State management

https://github.com/pmndrs/zustand

## UI animation

https://www.framer.com/docs/introduction/

## Style with TailWinds

https://tailwindcss.com/

## Tailwind

https://nx.dev/latest/react/guides/using-tailwind-css-in-react

## View schematics

```
yarn nx list @nrwl/reactce.
```

yarn nx generate @nrwl/react:library --help

## Debug with vscode

when you run electron, with attach, should save file twice currently, that destroy is slow than restart, that will cause restart fail.

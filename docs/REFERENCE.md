### What is the difference between 'path' and 'url' in match prop of React-Router <Route> component? | React Router Basics

- path - (string) The path pattern used to match. Useful for building nested <Route>s
- url - (string) The matched portion of the URL. Useful for building nested <Link>s

  Consider the route "/users/:userId". match.path would be "/users/:userId" while match.url would have the :userId value filled in, e.g. "users/5".

See this post from css-tricks.com for more information.
https://teamtreehouse.com/community/what-is-the-difference-between-path-and-url-in-match-prop-of-reactrouter-route-component-react-router-basics

### Would it be safe to enable nodeIntegration in Electron on a local page that is packaged with the app?

https://stackoverflow.com/questions/57505082/would-it-be-safe-to-enable-nodeintegration-in-electron-on-a-local-page-that-is-p

### should alway use contextIsolation

https://github.com/electron/electron/issues/23506
https://stackoverflow.com/questions/52236641/electron-ipc-and-nodeintegration/57656281#57656281

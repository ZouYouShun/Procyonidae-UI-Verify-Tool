### What is the difference between 'path' and 'url' in match prop of React-Router <Route> component? | React Router Basics

- path - (string) The path pattern used to match. Useful for building nested <Route>s
- url - (string) The matched portion of the URL. Useful for building nested <Link>s

  Consider the route "/users/:userId". match.path would be "/users/:userId" while match.url would have the :userId value filled in, e.g. "users/5".

See this post from css-tricks.com for more information.
https://teamtreehouse.com/community/what-is-the-difference-between-path-and-url-in-match-prop-of-reactrouter-route-component-react-router-basics

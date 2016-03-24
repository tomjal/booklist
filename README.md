# booklist

This is my attempt at a fully functioning book collection website as a way to become more closely acquainted with modern development tools I'm 
interested in, but don't get to use professionally. Progress is limited to what little free time I can find, which means it's slow; expect many parts of this
to be grossly incomplete at any given time.

All iterations will share the same data, data access, controllers, and AWS access code.  Controllers are sniffed out and wired with my easy-express-controllers 
project (https://www.npmjs.com/package/easy-express-controllers); data access is through Mongo; and all book info is looked up with my own AWS credentials, 
subject to an unfortunate one-request-per-second limit imposed by Amazon.

The first iteration, in progress, is with ReactJS, Redux and Bootstrap.  The (by no means comprehensive) tests are run with Gulp, Mocha, and Chai.  ES6
transpilation is through Babel, with Stage 1 features enabled to get decorators working, which are needed for the controller actions.  I'm also using the React-Bootstrap
extensions, for things like Modal and Collapse.

This module lives in the react-redux directory.  The directory structure underneath follows this pattern:

- applicationRoot contains the shared helpers which drive the application: rendering the module, shared components, etc.
- modules contains each section of the app, each of which exposes its own components, actions, reducers, etc.
- util contains various other helpers, usually 3rd party utilities like reselect or redux-thunk. 

Future iterations may potentially look at ... whatever is thriving whenever the React version is done.
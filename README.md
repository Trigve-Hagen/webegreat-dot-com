This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).<br>

What I intend to create is a CMS style e-commerce store that can use components much like bundles, plugins or modules with no hooks so the developer can have fun creating additional functionality. For syling you will just go through the code and create your modifications. I'm planing on using the least npm modules I can to get the most functionality while sticking to what facebook created as far as a starting point with create-react-app. React-router for links, Helmit for Seo, Redux for state, Express for Server, Mysql for database and webpack 4 plus Babel 7. Im also going to add in my own Arm class to speed up the creating and adjusting the database so you can just develop. You still just run build when finished and move your build or dist to your root directory when you are done developing. The idea is this be good for the end user because it will be faster than the average cms system producing better conversion rates.

Below you will find some information on how to perform common tasks and folder stucture of webegreat-dot-com. I haven't got much done yet so I haven't uploaded it to webegreat.com yet. It will use Twitter Bootstrap but you can change it to Material Ui, or Semantic UI or some other framework you like working with. I will work hard to keep each component in the tradition of a fully self contained component that is as loosly coupled to the rest of the application as possible.<br>

You can find the most recent version of create-react-app guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm build](#npm-run-build)
  - for now cd inside server and run node index.js to start the server.
- [Architecture Plans](#Architecture Plans)


## Folder Structure

After creation, your project should look like this:

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  server/
    config/
    index.js
  src/
    assets/
      css/
      font/
      js/
      img/
    components/
      component/
        index.js
        other-related.js
        reducer.js
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.<br>
You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.
I put them all in assets and ran a single webpack.config.js file in the root..

Only files inside `public` can be used from `public/index.html`.<br>
Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories.<br>
They will not be included in the production build so you can use them for things like documentation.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `Architecture Plans`

All Components will house all code including all components, reducers, css, server code file, routing file and areas that use these files will load them on page response. This will allow developers to create modules that we can just call Components for this framework. Will also upgrade to bootstrap@4 when react-bootstrap is finished updating.
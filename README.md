This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).<br>

What I intend to create is a CMS style e-commerce store that can use components much like bundles, plugins or modules with no hooks so the developer can have fun creating additional functionality. For syling you will just go through the code and create your modifications. I'm planing on using the least npm modules I can to get the most functionality while sticking to what facebook created as far as a starting point with create-react-app. React-router for links, Helmit for Seo, Redux for state, Express for Server, Mysql for database and webpack 4 plus Babel 7. Im also going to add in my own Arm class to speed up the creating and adjusting the database so you can just develop. You still just run build when finished and move your build or dist to your root directory when you are done developing. This should be really good for the end user too because since it is built in pure JavaScript and in a single page app style where there are no page refreshes only ajax calls to the server asyncronously it will be faster than the average cms system producing better conversion rates.

Below you will find some information on how to perform common tasks and folder stucture of webegreat-dot-com. I haven't got much done yet so I haven't uploaded it to webegreat.com yet. It will use Twitter Bootstrap but you can change it to Material Ui, or Semantic UI or some other framework you like working with. I will work hard to keep each component in the tradition of a fully self contained component that is as loosly coupled to the rest of the application as possible.<br>

To start with download the zip file and save it where ever you like. Once downloaded unzip the ziped file then cd into the unzipped folder by typing - `cd webegreat-dot-com` open a cmd cd inside the folder you extracted the ziped file to then type `npm install`. You might have to delete the package-lock.json to run npm install. If nothing gets downloaded erase it and try again. Once all the files have downloaded you can either type `npm start` to see the continuing saga of the front end or type `cd server && node index.js` to see how the back end is comming along. I just also added `npm run server-start` to start them both. Run this one from webegreat.com. Its still in development so code away if you like or keep coming back for new developments. The front and back end url is http://localhost:4000.<br>

You can find the most recent version of create-react-app guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm build](#npm-run-build)
  - [npm run server-start](#npm-run-server-start)
- [Arm Class](#arm-class)
- [Architecture Plans](#architecture-plans)
- [Credits](#credits)


## Folder Structure

After creation, your project should look like this:

```
my-app/
  node_modules/
  public/
    index.html
    favicon.ico
  server/
    config/
    server-routes/
      api/
        starter-server-modules.js
      index.js
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
      App.js
      App.test.js
      index.css
      index.js
    .babelrc
    package-lock.json
    package.json
    README.md
    webpack.config.js
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
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

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

### `npm run server-start`

run from root to start both the front end and server.

## Arm Class

The Arm stands for Array to Relational Database Mapping. Like ORM Object Relational Database Mapping it compares a data structure to the schema and update the database when A change is made to the data structure. Thus allowing you to work on your code without having to go back and forth to the database.

In a minute I will update npm Modules and the scripts in package.json to start the server whenever we start the front end and put a --watch so when you update the array your database will update automatically. I just haven't got there yet. Ill also document the adjustments and ins and outs carefully here so you know what to and what not to do.

* const mysqlhelpers = require('./config/mysqldbhelpers')(config.connection.name, config, connection);
* mysqlhelpers.buildTables();

This is called in index.js and kicks off the build database script. It gets passed the Database Name, the Database Array, and the Connection to the mysql database you are using. Don't forget to fill in your database configuation variables in config/mysqldbconfig.js. There is only creating and dropping databases at the moment. I will work on it futher in the future.

`Fields`<br>
Put all fields in for each row. They all follow the mysql database schema except Null.<br>
created_at with Type: 'date' = TIMESTAMP DEFAULT CURRENT_TIMESTAMP<br>
updated_at with Type: 'date' = TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

* Field: 'productid' - name of row
* Type: 'int(11)' - int, varchar, text, etc...
* Null: 'NOT NULL' - NULL, or NOT NULL
* Key: 'PRI' - only using PRI or ''
* Default: null - Not sure if this will put a default value in it yet. I didn't code it to.
* Extra: '' - Didn't code for this yet.

`CAUTION`<br>
When you erase from the array of objects you delete the corresponding tables in the database and loose any data you might have in it. Be carefull!

## Architecture Plans

All Components will house all code included in a component including main component, secondary components related to the main component, reducer, css, server code file, routing file, and Arm config file that will be consolidated into single blocks of code and object arrays on page load. This will allow developers to create Modules that we can just call Components based on the ideal behind this framework.

## Credits

People who have little bits of code in here but do not know it. Hehe. Learned alot from them.

`Keith Weaver`<br>
https://github.com/keithweaver/MERN-boilerplate<br>
https://www.youtube.com/channel/UCK4Onn_G6hYTQyo6tC3XY1w

`React-U`<br>
https://github.com/react-u/<br>
https://www.youtube.com/c/reactuniversity

`Code Realm`<br>
https://www.youtube.com/channel/UCUDLFXXKG6zSA1d746rbzLQ
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).<br>

It is completely mobile friendly and you can build your store from a mobile phone.<br>

What I intend to create is a CMS style e-commerce store that can use components much like bundles, plugins or modules with no hooks so the developer can have fun creating additional functionality. For syling you will just go through the code and create your modifications. I'm planing on using the least npm modules I can to get the most functionality while sticking to what facebook created as far as a starting point with create-react-app. React-router for links, Helmit for Seo, Redux for state, Express for Server, Mysql for database and webpack 4 plus Babel 7. Im also going to add in my own Arm class to speed up the creating and adjusting the database so you can just develop. You still just run build when finished and move your build or dist to your root directory when you are done developing. This should be really good for the end user too because since it is built in pure JavaScript and in a single page app style where there are no page refreshes only ajax calls to the server asyncronously it will be faster than the average cms system producing better conversion rates.

Below you will find some information on how to perform common tasks and folder stucture of webegreat-dot-com. I haven't got much done yet so I haven't uploaded it to webegreat.com yet. It will use Twitter Bootstrap but you can change it to Material Ui, or Semantic UI or some other framework you like working with. I will work hard to keep each component in the tradition of a fully self contained component that is as loosly coupled to the rest of the application as possible.<br>

Download the zip file and save it where ever you like. Once downloaded unzip and cd into the root folder by typing - `cd webegreat-dot-com` Then download all node_modules by typing `npm install`. The other way to download it is to type `git clone https://github.com/Trigve-Hagen/webegreat-dot-com.git` cd into webegreat-dot-com and run `npm-install`. You might have to delete the package-lock.json to run npm install. If no node_modules gets downloaded erase package-lock.json and type `npm-install` again. Once all the files have downloaded you can either type `npm run server-start` or if you are on the server type `npm run build` and a dist folder will be made with all the static files express needs to work. Its still in development so code away if you like or keep coming back for new developments.<br>

I've uploaded server configuration now but its in testing stage. Made a production set up in the server/index.js that redirects and uses the dist folder for static assets. Going to test at webegreat.com. Works great in development. Ment for nginx on ubuntu 16.04. After running npm install in production you will have to change the site_url in src/config/config.js to the domain of your website. Also you will need to update connection to your mysql database in src/server/config/mysqldbconfig.js. You need to proxy nginx to http://localhost:4000 and express will server both react and the server files together. Check out the Digital Ocean link for details.<br>

For the fallback system. All custom work will happen in the fallback_folder_name folder that you can set in the src/config/config.js. Put the same folder structure there as in src and the program will check for these folders and files first before using the ones in src. The idea will be to have another folder stucture exactly the same as the core code like magento. Then a module checks for code in the fallback_folder_name first before falling back to the core in src. Simply copy the file into the fallback_folder_name but in the same folder structure as src and make changes to it there so those in src stay the same. Also for now everything server wise is one file server.js and everything routing wise is in index.js for ease of developing but when the work is done and I start on the fallback system I will be putting server.js files and routing.js files in with each component and separating out index.js and server.js into these files based on the component needs. The module will then look for these files in each component and create a single file from these. Its the plan anyways I will see how it goes when I get there.<br>

There is a method for checking your errors on the server. testErrorsOnServer(content). You can use it to anonomously check for errors in production. It writes a file to /tmp/webegreat. You can change the name to whatever you like. The check for production server checks the path on the server for a certain folder this one it html.<br>if(!reqPath.split(path.sep).indexOf("html")) development<br>
else production

You can find the most recent version of create-react-app guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Input Sanitization](#input-sanitization)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm run server-start](#npm-run-server-start)
  - [npm run build](#npm-run-build) 
- [Arm Class](#arm-class)
- [Architecture Plans](#architecture-plans)
- [Credits](#credits)

## Input Sanitization

* `/^[\w\s.-]+$/i` Everything other than
* `/^[\w\W]+$/` Passwords way open - \w = [A-Za-z0-9_] - \W [^A-Za-z0-9_]
* `/^[\w.]+@[\w.]+.[A-Za-z]{2,}$/` Emails - Sort of tight. - You might have to adjust to get it to accept yours.
* `/^[0-9]+$/` Numbers

## Folder Structure

After creation, your project should look like this:

```
my-app/
  public/
    index.html
    favicon.ico
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
    server/
      config/
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

### `npm run server-start`

Runs the app in the development mode.<br>
Sets the mode for dev calls start and starts the server.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

You will need to restart to se changes on the server. You can customize it with nodemon.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

## Arm Class

The Arm stands for Array to Relational Database Mapping. Like ORM Object Relational Database Mapping it compares a data structure to the schema and update the database when A change is made to the data structure. Thus allowing you to work on your code without having to go back and forth to the database.

In a minute I will update npm Modules and the scripts in package.json to start the server whenever we start the front end and put a --watch so when you update the array your database will update automatically. I just haven't got there yet. Ill also document the adjustments and ins and outs carefully here so you know what to and what not to do.

* const mysqlhelpers = require('./config/mysqldbhelpers')(config.connection.name, config, connection);
* mysqlhelpers.buildTables();

This is called in index.js and kicks off the build database script. It gets passed the Database Name, the Database Array, and the Connection to the mysql database you are using. Don't forget to fill in your database configuation variables in config/mysqldbconfig.js. There is only creating and dropping databases at the moment. I will work on it futher in the future.

`server/config/mysqldbconfig.js`<br>
All config for the database is in server/config/mysqldbconfig.js. The databases are named alphabetically starting with a_ then b_ etc. to preserve the order when doing CRUD operations. If you add rows only add them to the end unless you want to recode whats already here. You will have to stop the server and restart it everytime you add new fields and tables. If you add new rows don't forget to update the CRUD already coded.

`Fields`<br>
Put all fields in for each row. They all follow the mysql database schema except Null and Key.
No Foriegn Key at the moment and just NULL and NOT NULL. PRIMARY KEYS are also as is.
You can get layouts for PRIMARY KEYS and TIMESTAMP from the code. They are all that has been tested.
You can change fallback_folder_name in src/config/config.js and names of tables and rows in mysqldbconfig.js for security purposes. The program read tables and rows by indexes so you can change the names to any allowable name. Please only add rows to the ends of the tables and tables to the end of the list to preserve the functionality unless you intend to change the functionality in server.js too.

* `Field: 'productid'` - userid, name, created_at, updated_at, etc...
* `Type: 'int(11)'` - int(11), varchar(255), text, timestamp, etc...
* `Null: 'NOT NULL'` - NULL or NOT NULL
* `Key: 'PRI'` - PRI or ''
* `Default: null` - DEFAULT 1, DEFAULT CURRENT_TIMESTAMP, etc...
* `Extra: 'AUTO_INCREMENT'` - AUTO_INCREMENT, ON UPDATE CURRENT_TIMESTAMP, etc...

`CAUTION`<br>
When you erase from the array of objects you delete the corresponding tables in the database and loose any data you might have in it. Be carefull!

## Architecture Plans

All Components will house all code included in a component including main component, secondary components related to the main component, reducer, css, server code file, routing file, and Arm config file that will be consolidated into single blocks of code and object arrays on page load. This will allow developers to create Modules that we can just call Components based on the ideal behind this framework.

## Credits

People who have little bits of code in here but do not know it. Hehe. Learned alot from them. Also for help setting up your Paypal account please check out the bottom video from Traversy Media.

`Keith Weaver`<br>
login system both standard and with github which I used to also do facebook<br>
https://github.com/keithweaver/MERN-boilerplate<br>
https://www.youtube.com/channel/UCK4Onn_G6hYTQyo6tC3XY1w

`React-U`<br>
Redux training and building out the cart. Also some game making training.<br>
https://github.com/react-u/<br>
https://www.youtube.com/c/reactuniversity

`Code Realm`<br>
webpack 4 plus Babel 7<br>
https://www.youtube.com/channel/UCUDLFXXKG6zSA1d746rbzLQ

`Traversy Media`<br>
paypal integration<br>
https://www.youtube.com/watch?v=7k03jobKGXM<br>
https://github.com/paypal/PayPal-node-SDK<br>
https://github.com/paypal/PayPal-node-SDK/blob/master/samples/payment/execute.js<br>
https://github.com/paypal/PayPal-node-SDK/issues/79

`Digital Ocean`<br>
by Brennen Bearnes<br>
Server configurations for nginx on Ubuntu 16.04 using React as a front end.<br>
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

`Tutorials Point`<br>
Express server tutorial<br>
https://www.tutorialspoint.com/expressjs/expressjs_sessions.htm

`Shakhor Smith`<br>
nodemailer<br>
https://www.youtube.com/watch?v=HZOXPta21PI&t=33s<br>
https://www.youtube.com/watch?v=EPnBO8HgyRU<br>
https://www.w3schools.com/nodejs/nodejs_email.asp

`TechWarriorz & Leon Watson`<br>
Socket.io
https://www.youtube.com/watch?v=rGawLIqi21c&t=2738s<br>
https://www.youtube.com/watch?v=6VFeJSwNj5w

`Code refrences`<br>
https://reactjs.org<br>
https://www.youtube.com/watch?v=xa-_FIy2NgE<br>
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions<br>
https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/lifecycle_methods_overview.html

`Other interesting stuff`<br>
I have yet to dive into.<br>
https://nodeschool.io/<br>
https://projecteuler.net/archives<br>
https://www.youtube.com/watch?v=SuzutbwjUp8<br>
https://www.youtube.com/watch?v=ubXtOROjILU<br>
https://egghead.io/lessons/react-redux-the-single-immutable-state-tree<br>

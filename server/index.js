const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config/mysqldbconfig');
const app = express();
app.use(cors());

const connection = mysql.createConnection({
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.pass,
    database: config.connection.name
});

connection.connect(err => {
    if(err) {
        return err;
    }
});

const mysqlhelpers = require('./config/mysqldbhelpers')(config.connection.name, config, connection);
console.log(mysqlhelpers.listDbTables());

// API routes
require('./server-routes')(app);

app.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
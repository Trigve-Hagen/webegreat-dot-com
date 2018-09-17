const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config/mysqldbconfig');
const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.pass,
    database: config.connection.name,
    queueLimit : 0,
    connectionLimit : 0
});

connection.connect(err => {
    if(err) {
        console.log(err);
    }
});

const mysqlhelpers = require('./config/mysqldbhelpers')(config.connection.name, config, connection);
console.log(mysqlhelpers.buildTables());

// API routes
require('./server-routes')(app, connection);

app.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
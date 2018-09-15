const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config/mysqldbconfig');


const app = express();

const SELECT_ALL_PRODUCTS = 'SELECT * FROM products';


const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.name
});

connection.connect(err => {
    if(err) {
        return err;
    }
});

const mysqlhelpers = require('./config/mysqldbhelpers')(config.name, config, connection);
console.log(mysqlhelpers.listDbTables());

app.use(cors());
app.get('/', (req, res) => {
    const CHECK_IF_DATABASE_CREATED = `SELECT 1 FROM ${config.usersTable} LIMIT 1`;
    connection.query(CHECK_IF_DATABASE_CREATED, (err, results) => {
        if(err) {

            //return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/products/add', (req, res) => {
    const { name, description, price } = req.query;
    const INSERT_PRODUCTS = `INSERT INTO products VALUES('4', '${name}', '${description}', '${price}')`;
    connection.query(INSERT_PRODUCTS, (err, results) => {
        if(err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.send('Successfully added product');
        }
    });
});

app.get('/products', (req, res) => {
    connection.query(SELECT_ALL_PRODUCTS,(err, results) => {
        if(err) {
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
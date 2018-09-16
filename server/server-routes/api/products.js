const mysql = require('mysql');
const config = require('../../config/mysqldbconfig');

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

module.exports = (app) => {
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
        const SELECT_ALL_PRODUCTS = 'SELECT * FROM products';
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
}
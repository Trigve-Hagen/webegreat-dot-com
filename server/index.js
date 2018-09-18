const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config/mysqldbconfig');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.pass,
    database: config.connection.name
});

connection.connect(err => {
    if(err) {
        console.log(err);
    }
});

const mysqlhelpers = require('./config/mysqldbhelpers')(config.connection.name, config, connection);
mysqlhelpers.buildTables();

// API routes
//require('./server-routes')(app);

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validatePassword(password, dbPassword) {
    return bcrypt.compareSync(password, dbPassword);
};

app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const {
        name,
        password
    } = body;
    let { email } = body;

    if(!name) {
        return res.send({
        success: false,
        message: 'Error: Name cannot be blank'
        });
    }
    if(!email) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank'
        });
    }
    if(!password) {
        return res.send({
        success: false,
        message: 'Error: Password name cannot be blank'
        });
    }

    email = email.toLowerCase();

    let testForExistingUser = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [config.tables[2].table_name, config.tables[2].table_fields[4].Field, email];
    testForExistingUser = mysql.format(testForExistingUser, inserts);
    //console.log(testForExistingUser);
    connection.query(testForExistingUser, function (error, results, fields) {
        if(error) {
            //console.log("Error: in SignIn: " + error);
            return res.send({
                success: false,
                message: 'Server Error in Check User Exsists',
                token: null,
                id: null
            });
        } else {
            if(results.length > 0) {
                //console.log("Results: in SignIn: User Exists");
                return res.send({
                    success: false,
                    message: 'User Exists',
                    token: null,
                    id: null
                });
            } else {
                currentTimestamp = moment().unix();//in seconds
                let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");

                var insertUserIfNonExists = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, 1)";
                var inserts = [config.tables[2].table_name, myDate, myDate, name, email, generateHash(password)];
                insertUserIfNonExists = mysql.format(insertUserIfNonExists, inserts);
                //console.log(insertUserIfNonExists);
                connection.query(insertUserIfNonExists, function (err, result, fields) {
                    if(err) {
                        //console.log("Error: in Register New User: " + err);
                        return res.send({
                            success: false,
                            message: 'Server Error in Register',
                            token: null,
                            id: null
                        });
                    } else {
                        //console.log(result.insertId);
                        var insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                        var inserts = [config.tables[3].table_name, result.insertId, myDate, myDate];
                        insertUserSession = mysql.format(insertUserSession, inserts);
                        connection.query(insertUserSession, function (error, results, fields) {
                            if(error) {
                                //console.log("Error: in Register Session: " + error);
                                return res.send({
                                    success: false,
                                    message: 'Server Error in Register Session',
                                    token: null,
                                    id: null
                                });
                            } else {
                                //console.log("Results: in SignIn: " + results);
                                return res.send({
                                    success: true,
                                    message: 'Successfull Registration',
                                    token: results.insertId,
                                    id: result.insertId
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if(!email) {
      return res.send({
        success: false,
        message: 'Error: Email name cannot be blank'
      });
    }
    if(!password) {
      return res.send({
        success: false,
        message: 'Error: Password name cannot be blank'
      });
    }

    email = email.toLowerCase();

    let testForExistingUser = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [config.tables[2].table_name, config.tables[2].table_fields[4].Field, email];
    testForExistingUser = mysql.format(testForExistingUser, inserts);
    //console.log(testForExistingUser);
    connection.query(testForExistingUser, function (error, results, fields) {
        if(error) {
            //console.log("Error: in SignIn: " + error);
            return res.send({
                success: false,
                message: 'Server Error in Check User Exsists',
                token: null,
                id: null
            });
        } else {
            if(results.length == 1) {
                if(results[0].email == email && validatePassword(password, results[0].password)) {
                    currentTimestamp = moment().unix();//in seconds
                    let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");

                    var insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                    var inserts = [config.tables[3].table_name, results[0].userid, myDate, myDate];
                    insertUserSession = mysql.format(insertUserSession, inserts);
                    connection.query(insertUserSession, function (error, result, fields) {
                        if(error) {
                            //console.log("Error: in Register Session: " + error);
                            return res.send({
                                success: false,
                                message: 'Server Error in Register Session',
                                token: null,
                                id: null
                            });
                        } else {
                            //console.log("Results: in SignIn: " + result);
                            return res.send({
                                success: true,
                                message: 'Successfull SignIn',
                                token: result.insertId,
                                id: results[0].userid
                            });
                        }
                    });
                }
            } else {
                //console.log("Results: in SignIn: Please Register");
                return res.send({
                    success: false,
                    message: 'Please Register',
                    token: null,
                    id: null
                });
            }
        }
    });
});

app.get('/api/account/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    let testForExistingSession = "SELECT * FROM ?? WHERE ?? = ? AND ?? = 0";
    let inserts = [config.tables[3].table_name, config.tables[3].table_fields[0].Field, token, config.tables[3].table_fields[3].Field];
    testForExistingSession = mysql.format(testForExistingSession, inserts);
    //console.log(testForExistingUser);
    connection.query(testForExistingSession, function (error, results, fields) {
        if(error) {
            //console.log("Error: in SignIn: " + error);
            return res.send({
                success: false,
                message: 'Server Error in Check User Exsists',
                token: null,
                id: null
            });
        } else {
            if(results.length != 1) {
                return res.send({
                    success: false,
                    message: 'Invalid Session. Please Sign In.'
                });
            } else {
                //console.log("Results: in SignIn: Please Register");
                return res.send({
                    success: true,
                    message: 'Session Valid.'
                });
            }
        }
    });
});

/*app.get('/api/account/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    const updated = Date.now();

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: { isDeleted: true, updated: updated }
    }, null, (err, sessions) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: Server Error'
            });
        }
        
        return res.send({
            success: true,
            message: 'Logged Out'
        });
    });
});*/

app.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
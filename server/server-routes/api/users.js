//const mysql = require('mysql');
const config = require('../../config/mysqldbconfig');
const bcrypt = require('bcryptjs');
const moment = require('moment');

/*const connection = mysql.createConnection({
    host: config.connection.name,
    user: config.connection.user,
    password: config.connection.pass,
    database: config.connection.name
});

connection.connect(err => {
    if(err) {
        console.log(err);
    }
});*/

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = (app, connection) => {
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

        const CHECK_IF_USER_EXISTS = `SELECT 1 FROM ${config.tables[2].table_name} WHERE ${config.tables[2].table_fields[4].Field}='${email}'`;
        console.log(CHECK_IF_USER_EXISTS);
        try {
            connection.query(CHECK_IF_USER_EXISTS, (err, results) => {
                if(err) {
                    exist(err);
                    console.log("Error: in SignIn: " + err);
                    return res.send({
                        success: false,
                        message: 'Server Error in Check User Exsists',
                        token: null,
                        id: null
                    });
                } else {
                    console.log("Results: in SignIn: " + results);
                    return res.send({
                        success: false,
                        message: 'User Exists',
                        token: null,
                        id: null
                    });
                }
            });
        } catch(e) {
            currentTimestamp = moment().unix();//in seconds
            let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");
            //console.log(myDate);
            //const CHECK_INSERT_INTO_USERS_DATABASE = `INSERT INTO ${config.tables[2].table_name} VALUES(DEFAULT, '${myDate}', '${myDate}', '${name}', '${email}', '${generateHash(password)}', 1);`;
            //console.log(CHECK_INSERT_INTO_USERS_DATABASE);
            connection.query('INSERT INTO ' + config.tables[2].table_name + ' VALUES(DEFAULT, ' + myDate + ', ' + myDate + ', ' + name + ', ' + email + ', ' + generateHash(password) + ', 1)', (err, result) => {
                if(err) {
                    console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server Error in Register',
                        token: null,
                        id: null
                    });
                } else {
                    const CHECK_INSERT_INTO_USERSESSION_DATABASE = `INSERT INTO ${config.tables[3].table_name} VALUES(DEFAULT, '${myDate}', '${myDate}', 0);`;
                    connection.query(CHECK_INSERT_INTO_USERSESSION_DATABASE, (err, results) => {
                        if(err) {
                            console.log("Error: in Register Session: " + err);
                            return res.send({
                                success: false,
                                message: 'Server Error in Register Session',
                                token: null,
                                id: null
                            });
                        } else {
                            console.log("Results: in SignIn: " + results);
                            return res.send({
                                success: true,
                                message: 'Valid Signin',
                                token: results.insertId,
                                id: result.insertId
                            });
                        }
                    });
                }
            });
        }
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
  
        User.find({
            email: email
        }, (err, users) => {
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: User not registered'
                });
            }

            const user = users[0];
            if(!user.validatePassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Password'
                });
            }

            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.loginType = 'casino';
            userSession.save((err, doc) => {
                if(err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server Error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Valid Signin',
                    token: doc._id,
                    id: user._id
                });
            });
        });
    });

    app.get('/api/account/verify', (req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if(sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Multiple users'
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Verified'
                });
            }
        });
    });

    app.get('/api/account/logout', (req, res, next) => {
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
    });
};
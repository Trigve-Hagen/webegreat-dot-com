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

    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const {
            fullName,
            password
        } = body;
        let { email } = body;

        if(!fullName) {
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

        const CHECK_IF_USER_EXISTS = `SELECT * FROM ${config.name} WHERE ${config.tables[3].table_fields[1]}='${email}'`;
        console.log(CHECK_IF_USER_EXISTS)
        connection.query(CHECK_IF_USER_EXISTS, (err, results) => {
            if(err) {
                console.log(err);
                //return res.send(err);
            } else {
                console.log(results);
                //return res.json({
                    //data: results
                //})
            }
        });

        /*User.find({
            email: email
        }, (err, previousUsers) => {
            if(err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            } else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exists'
                });
            }
            const newUser = new User();
    
            newUser.email = email;
            newUser.fullName = fullName;
            newUser.avatarUrl = avatarUrl;
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if(err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: 'Error: Server Error'
                    });
                } else {
                    const userSession = new UserSession();
                    userSession.userId = user._id;
                    userSession.loginType = 'casino';
                    userSession.save((err, doc) => {
                        if(err) {
                            console.log(err);
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
                }
            });
        });*/
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
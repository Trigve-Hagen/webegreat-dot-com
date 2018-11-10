const express = require('express');
const util = require('util');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const fileUpload = require('express-fileupload');
const paypal = require('paypal-rest-sdk');
const nodemailer = require('nodemailer');
const config = require('./config/mysqldbconfig');
const urlConfig = require('../config/config');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const {
    VERIFY_USER,
    USER_CONNECTED,
    COMMUNITY_CHAT,
    USER_DISCONNECTED,
    MESSAGE_RECIEVED,
    PRIVATE_MESSAGE,
    MESSAGE_SENT,
    LOGOUT,
    TYPING
} = require('../components/chat/chat-events');
const {
    createChat,
    createMessage,
    createUser
} = require('../components/chat/chat-helpers')

let communityChat = createChat();
let connectedUsers = {};
let chats = [communityChat];


io.on('connection', function(socket) {
    let sendMessageToChatFromUser;
    let sendTypingFromUser;

    socket.on(VERIFY_USER, (name, callback) => {
        if(isUser(connectedUsers, name)) {
            callback({ isUser: true, user: null });
        } else {
            callback({ isUser: false, user: createUser({ name: name, socketId: socket.id }) });
        }
    });

    socket.on(USER_CONNECTED, (user) => {
        user.socketId = socket.id;
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        sendMessageToChatFromUser = sendMessageToChat(user.name);
        //console.log(sendMessageToChatFromUser);
        sendTypingFromUser = sendTypingToChat(user.name);

        io.emit(USER_CONNECTED, connectedUsers);
    });

    socket.on('disconnect', () => {
        if("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.name);

            io.emit(USER_DISCONNECTED, connectedUsers);
            console.log("Disconnect: " + connectedUsers);
        }
    });

    socket.on(COMMUNITY_CHAT, (callback) => {
        callback(communityChat);
    });

    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        io.emit(USER_DISCONNECTED, connectedUsers);
        console.log("Logout: " + connectedUsers);
    });

    socket.on(MESSAGE_SENT, ({chatId, message}) => {
        sendMessageToChatFromUser(chatId, message);
    });

    socket.on(TYPING, ({chatId, isTyping}) => {
        sendTypingFromUser(chatId, isTyping);
    });

    socket.on(PRIVATE_MESSAGE, ({reciever, sender, activeChat}) => {
        if(reciever in connectedUsers) {
            const recieverSocket = connectedUsers[reciever].socketId;
            if(activeChat === null || activeChat.id === communityChat.id) {
                const newChat = createChat({ name: `${reciever}&${sender}`, users: [reciever, sender] });
                console.log(newChat);
                socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat);
                socket.emit(PRIVATE_MESSAGE, newChat);
            } else {
                socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat);
            }
        }
    })

});

const sendTypingToChat = (user) => {
    return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, {user, isTyping})
    }
}

const sendMessageToChat = (sender) => {
    return (ChatId, message) => {
        io.emit(`${MESSAGE_RECIEVED}-${ChatId}`, createMessage({message, sender}))
    }
}

const addUser = (userList, user) => {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
}

const removeUser = (userList, username) => {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList;
}

const isUser = (userList, username) => {
    return username in userList;
}

//console.log(util.inspect(token, {showHidden: false, depth: null}))

let reqPath = path.join(__dirname, '../'); let imagePath = '';
if(reqPath.split(path.sep).indexOf("html") == -1) {
    imagePath = reqPath + 'assets';
} else {
    imagePath = reqPath + '/dist';
    app.use(express.static(path.join(reqPath, 'dist')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(reqPath, 'dist', 'index.html'));
    });
}

let currentTimestamp = moment().unix();
let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const connection = mysql.createConnection({
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.pass,
    database: config.connection.name
});
connection.connect(err => { if(err) console.log(err); });

const mysqlBuildTables = require('./config/mysqldbhelpers')(
    config.connection.name, config, connection, moment, fs, reqPath
);
mysqlBuildTables.buildTables();

// API routes
// require('./server-routes')(app);

// need to encrypt and decrypt the token in local storage and Paypal Credentials in the database.
// checktoken always with admin actions that modify the database. Its our crf token for the database.
// next we need a crf token for securing switching from page to page in admin from register or login to logout.
function urlExists(url) {
    return fs.existsSync(url);
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validatePassword(password, dbPassword) {
    return bcrypt.compareSync(password, dbPassword);
};

function uniqueId(id) {
    return parseInt(id) - 50 * 2;
}

function testErrorsOnServer(content) {
    fs.writeFile("/tmp/webegreat", content, function(err) {
        if(err) console.log(err);
        else console.log("The file was saved!");
    });
};

function sendMail(mailOptions) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.emailer.email,
          pass: config.emailer.password
        }
    });

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.send({
                success: false,
                message: 'Error sending message. Please try again later.'
            });
        } else {
            return res.send({
                success: false,
                message: 'Message sent. We will get back to you shortly.'
            });
        }
    });
}

function bufferToHex(buffer) {
    return Array
        .from (new Uint8Array (buffer))
        .map (b => b.toString (16).padStart (2, "0"))
        .join ("");
}

function validateImageUpload(file) {
    let imageParts = file.file.name.split(".");
    console.log(file);
    if(imageParts[1] == urlConfig.allowed_images_magic[0].ext && imageParts[1] == 'gif' && file.file.mimetype == urlConfig.allowed_images_magic[0].type) {
        console.log("Name and mime passed.");
        let hexString = bufferToHex(file.file.data.slice(0, 4));
        if(hexString.toString() == urlConfig.allowed_images_magic[0].magic.toString()) return true;
        else return false;
    } else if((imageParts[1] == urlConfig.allowed_images_magic[1].ext || 'jpeg') && (imageParts[1] == 'jpg' || 'jpeg') && (file.file.mimetype == urlConfig.allowed_images_magic[1].type || file.file.mimetype == 'image/jpeg')) {
        console.log("Name and mime passed.");
        let hexString = bufferToHex(file.file.data.slice(0, 2));
        if(hexString.toString() == urlConfig.allowed_images_magic[1].magic.toString()) return true;
        else return false;
    } else if (imageParts[1] == urlConfig.allowed_images_magic[3].ext && imageParts[1] == 'png' && file.file.mimetype == urlConfig.allowed_images_magic[3].type) {
        console.log("Name and mime passed.");
        let hexString = bufferToHex(file.file.data.slice(0, 4));
        if(hexString.toString() == urlConfig.allowed_images_magic[3].magic.toString()) return true;
        else return false;
    } else return false;
}

/*
 ***************************** Socket.io *******************************
 ***********************************************************************
 */

app.get('/api/chat/app', function (req, res) {
    res.send('hello world')
})


/*
 ************************ Registration && Signup ***********************
 ***********************************************************************
 */

app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const {
        name,
        password
    } = body;
    let { email } = body;

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
        success: false,
        message: 'Error: Name cannot be blank or invalid'
        });
    }
    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank or invalid'
        });
    }
    if(!password || !config.patterns.passwords.test(password)) {
        return res.send({
        success: false,
        message: 'Error: Password name cannot be blank or invalid'
        });
    }

    email = email.toLowerCase();

    let testForExistingUser = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [
        config.tables[2].table_name,
        config.tables[2].table_fields[4].Field, email
    ];
    testForExistingUser = mysql.format(testForExistingUser, inserts);
    connection.query(testForExistingUser, function (error, results, fields) {
        if(error) {
            testErrorsOnServer(testForExistingUser + ", " + error);
            return res.send({
                success: false,
                message: 'Server Error in check user exsists signup',
                token: null,
                id: null
            });
        } else {
            if(results.length > 0) {
                return res.send({
                    success: false,
                    message: 'User Exists',
                    token: null,
                    id: null
                });
            } else {
                var insertUserIfNonExists = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, 1, 'user-avatar.jpg', 0, '', '', '', '')";
                var inserts = [
                    config.tables[2].table_name,
                    myDate, myDate, name, email, generateHash(password)
                ];
                insertUserIfNonExists = mysql.format(insertUserIfNonExists, inserts);
                connection.query(insertUserIfNonExists, function (err, result, fields) {
                    if(err) {
                        return res.send({
                            success: false,
                            message: 'Server error in register users insert',
                            token: null,
                            id: null
                        });
                    } else {
                        signUpDir = reqPath + '/assets/img/avatar/' + uniqueId(result.insertId);
                        if (fs.existsSync(signUpDir)) {
                            return res.send({
                                success: false,
                                message: 'User avatar folder exist on server.',
                                token: null,
                                id: null
                            });
                        } else {
                            fs.mkdir(signUpDir, function(err, data) {
                                if(err) {
                                    return res.send({
                                        success: false,
                                        message: 'Could not make folder.',
                                        token: null,
                                        id: null
                                    });
                                } else {
                                    fs.readFile(reqPath + '/assets/img/user-avatar.jpg', function (err, imageData) {
                                        if (err) {
                                            return res.send({
                                                success: false,
                                                message: 'Could not read image.',
                                                token: null,
                                                id: null
                                            });
                                        } else {
                                            fs.writeFile(reqPath + '/assets/img/avatar/' + uniqueId(result.insertId) + '/user-avatar.jpg', imageData, function (err) {
                                                if (err) {
                                                    return res.send({
                                                        success: false,
                                                        message: 'Could not write image.',
                                                        token: null,
                                                        id: null
                                                    });
                                                } else {
                                                    //console.log(result.insertId);
                                                    var insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                                                    var inserts = [
                                                        config.tables[3].table_name,
                                                        result.insertId, myDate, myDate
                                                    ];
                                                    insertUserSession = mysql.format(insertUserSession, inserts);
                                                    connection.query(insertUserSession, function (error, results, fields) {
                                                        if(error) {
                                                            //console.log("Error: in Register Session: " + error);
                                                            return res.send({
                                                                success: false,
                                                                message: 'Server error in register session insert',
                                                                token: null,
                                                                id: null
                                                            });
                                                        } else {
                                                            var mailOptions = {
                                                                from: config.emailer.email,
                                                                to: config.emailer.email,
                                                                subject: 'Click the link below to complete signup',
                                                                html: '<p>Thank you for signing up ' + name + '. Please click this link to confirm your email.</p><br /><a href="' + urlConfig.site_url + urlConfig.emailer.signup_complete + '?email=' + email + '" target="_blank">Click here to confirm email</a>'
                                                            };
                                                            sendMail(mailOptions);
                                                            return res.send({
                                                                success: true,
                                                                message: 'Successfull registration',
                                                                token: results.insertId
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

/*app.post('/api/account/signup-complete', (req, res, next) => {
    const { body } = req;
    let { email } = body;

    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank or invalid'
        });
    }

    email = email.toLowerCase();

    let updateIfActiveUser = "UPDATE ?? SET ?? = 1 WHERE ?? = ?";
    let inserts = [
        config.tables[2].table_name,
        config.tables[2].table_fields[8].Field,
        config.tables[2].table_fields[4].Field, email
    ];
    updateIfActiveUser = mysql.format(updateIfActiveUser, inserts);
    connection.query(updateIfActiveUser, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in check user exsists signin',
            });
        } else {
            return res.send({
                success: true,
                message: 'Success'
            });
        }
    });
});*/

app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank or invalid'
        });
    }
    if(!password || !config.patterns.passwords.test(password)) {
        return res.send({
        success: false,
        message: 'Error: Password name cannot be blank or invalid'
        });
    }

    email = email.toLowerCase();

    let testForExistingUser = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [
        config.tables[2].table_name,
        config.tables[2].table_fields[4].Field, email
    ];
    testForExistingUser = mysql.format(testForExistingUser, inserts);
    connection.query(testForExistingUser, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in check user exsists signin',
                token: null,
                id: null
            });
        } else {
            if(results.length == 1) {
                if(results[0].email == email && validatePassword(password, results[0].password)) {
                    var insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                    var inserts = [
                        config.tables[3].table_name,
                        results[0].userid,
                        myDate, myDate
                    ];
                    insertUserSession = mysql.format(insertUserSession, inserts);
                    connection.query(insertUserSession, function (error, result, fields) {
                        if(error) {
                            return res.send({
                                success: false,
                                message: 'Server Error in Register Session',
                                token: null,
                                id: null
                            });
                        } else {
                            return res.send({
                                success: true,
                                message: 'Successfull SignIn',
                                token: result.insertId,
                                role: results[0][config.tables[2].table_fields[6].Field]
                            });
                        }
                    });
                }
            } else {
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

app.post('/api/account/logout', (req, res, next) => {
    const { body } = req;
    const { token } = body;
    let setLoggedOutSession = "UPDATE ?? SET ?? = 1 WHERE ?? = ?";
    let inserts = [
        config.tables[3].table_name,
        config.tables[3].table_fields[4].Field,
        config.tables[3].table_fields[0].Field, token
    ];
    setLoggedOutSession = mysql.format(setLoggedOutSession, inserts);
    connection.query(setLoggedOutSession, function (error, result, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in log out Session'
            });
        } else {
            return res.send({
                success: true,
                message: 'Successfull Logout'
            });
        }
    });
});

/*app.get('/api/account/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    let testForExistingSession = "SELECT * FROM ?? WHERE ?? = ? AND ?? = 0";
    let inserts = [
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token, config.tables[3].table_fields[3].Field
    ];
    testForExistingSession = mysql.format(testForExistingSession, inserts);
    connection.query(testForExistingSession, function (error, results, fields) {
        if(error) {
            testErrorsOnServer(testForExistingSession + ", " + error);
            return res.send({
                success: false,
                message: 'Server Error in check user exsists verify.',
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
                return res.send({
                    success: true,
                    message: 'Session Valid.'
                });
            }
        }
    });
});*/

/*
 ********************** Menu Upload && Update ***********************
 ***********************************************************************
 */

app.post('/api/menu/update', function(req, res) {
    const { body } = req;
    const {
        id,
        name,
        level,
        parent,
        ifproduct,
        ifactive,
        ifdropdown,
        description,
        token
    } = body;
    let updateObj = [];

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Menu id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(config.patterns.names.test(name)) {
        updateObj.push({
            name: config.tables[7].table_fields[4].Field,
            content: name
        });
    } else {
        if(name != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.names.test(description)) {
        updateObj.push({
            name: config.tables[7].table_fields[7].Field,
            content: description
        });
    } else {
        if(description != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(ifactive)) {
        updateObj.push({
            name: config.tables[7].table_fields[9].Field,
            content: parseInt(ifactive)
        });
    } else {
        if(ifactive != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(ifdropdown)) {
        updateObj.push({
            name: config.tables[7].table_fields[10].Field,
            content: parseInt(ifdropdown)
        });
    } else {
        if(ifdropdown != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(level)) {
        updateObj.push({
            name: config.tables[7].table_fields[5].Field,
            content: parseInt(level)
        });
    } else {
        if(level != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.names.test(parent)) {
        updateObj.push({
            name: config.tables[7].table_fields[6].Field,
            content: parent
        });
    } else {
        if(parent != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(ifproduct)) {
        updateObj.push({
            name: config.tables[7].table_fields[8].Field,
            content: parseInt(ifproduct)
        });
    } else {
        if(ifproduct != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid.'
            });
        } else {
            let updateMenu = "UPDATE ?? SET ";
            let updateMenuInserts = [
                config.tables[7].table_name
            ];
            let objCount=0;
            updateObj.forEach(element => {
                if(updateObj.length - 1 == objCount) updateMenu += "?? = ? ";
                else updateMenu += "?? = ?, ";
                updateMenuInserts.push(element.name);
                updateMenuInserts.push(element.content);
                objCount++;
            });
            updateMenu += `WHERE ?? = ${id} AND ?? = ${results[0][config.tables[3].table_fields[1].Field]}`;
            updateMenuInserts.push(config.tables[7].table_fields[0].Field);
            updateMenuInserts.push(config.tables[7].table_fields[1].Field);
            
            updateMenu = mysql.format(updateMenu, updateMenuInserts);
            connection.query(updateMenu, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in menu update'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Your menu has been successfully updated.',
                        id: id,
                        name: name,
                        level: level,
                        parent: parent,
                        ifproduct: ifproduct,
                        ifactive: ifactive,
                        ifdropdown: ifdropdown,
                        description: description,
                    });
                }
            });
        }
    });
});

app.post('/api/menu/delete-item', function(req, res) {
    const { body } = req;
    const {
        id,
        token
    } = body;

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in check userid delete menu.'
            });
        } else {
            let deleteMenu = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
            let deleteMenuInserts = [
                config.tables[7].table_name,
                config.tables[7].table_fields[0].Field,
                id,
                config.tables[7].table_fields[1].Field,
                results[0][config.tables[3].table_fields[1].Field],
            ];
            deleteMenu = mysql.format(deleteMenu, deleteMenuInserts);
            connection.query(deleteMenu, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in delete menu row.'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success'
                    });
                }
            });
        }
    });
});

app.post('/api/menu/front', function(req, res) {
    let getFrontMenu = "SELECT * FROM ??";
    let getFrontMenuInserts = [
        config.tables[7].table_name
    ];
    getFrontMenu = mysql.format(getFrontMenu, getFrontMenuInserts);
    connection.query(getFrontMenu, function (err, result, fields) {
        if(err) {
            console.log("Error: in load all menu: " + err);
            return res.send({
                success: false,
                message: 'Server Error in load all menu.'
            });
        } else {
            return res.send({
                success: true,
                message: "Success",
                menuItems: result
            });
        }
    });
});

app.post('/api/menu/upload', function(req, res) {
    const { body } = req;
    const {
        name,
        level,
        parent,
        description,
        ifproduct,
        ifactive,
        ifdropdown,
        token
    } = body;

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
            success: false,
            message: 'Product name invalid or cannot be left empty.'
        });
    }

    if(!ifactive || !config.patterns.numbers.test(ifactive)) {
        return res.send({
            success: false,
            message: 'If active invalid or cannot be left empty.'
        });
    }

    if(!ifdropdown || !config.patterns.numbers.test(ifdropdown)) {
        return res.send({
            success: false,
            message: 'If dropdown invalid or cannot be left empty.'
        });
    }

    if(!level || !config.patterns.numbers.test(level)) {
        return res.send({
            success: false,
            message: 'Level invalid or cannot be left empty.'
        });
    }

    if(!parent || !config.patterns.names.test(parent)) {
        return res.send({
            success: false,
            message: 'Parent invalid or cannot be left empty.'
        });
    }

    if(!description || !config.patterns.names.test(description)) {
        return res.send({
            success: false,
            message: 'Description invalid or cannot be left empty.'
        });
    }

    if(!ifproduct || !config.patterns.names.test(ifproduct)) {
        return res.send({
            success: false,
            message: 'Ifproduct invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.names.test(token)) {
        return res.send({
            success: false,
            message: 'Invalid token.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    //console.log(getUserIdSession);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid upload menu.'
            });
        } else {
            var insertMenu = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var insertMenuInserts = [
                config.tables[7].table_name,
                results[0][config.tables[3].table_fields[1].Field],
                myDate, myDate, name,
                level, parent, description, ifproduct, ifactive, ifdropdown
            ];
            insertMenu = mysql.format(insertMenu, insertMenuInserts);
            connection.query(insertMenu, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in upload menu'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Your menu item has been successfully uploaded.',
                        id: result.insertId,
                        name: name,
                        level: level,
                        parent: parent,
                        description: description,
                        ifactive: ifactive,
                        ifdropdown: ifdropdown,
                        ifproduct: ifproduct
                    });
                }
            });
        }
    });
});

/*
 ********************** Product Upload && Update ***********************
 ***********************************************************************
 */


app.post('/api/product/menulinks', function(req, res) {
    const { body } = req;
    const {
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getMenuLinksForSelect = "SELECT * FROM ?? WHERE ?? = 1";
    let getMenuLinksForSelectInserts = [
        config.tables[7].table_name,
        config.tables[7].table_fields[8].Field
    ];
    getMenuLinksForSelect = mysql.format(getMenuLinksForSelect, getMenuLinksForSelectInserts);
    connection.query(getMenuLinksForSelect, function (error, result, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get product details.'
            });
        } else {
            return res.send({
                success: true,
                message: 'Success',
                links: result
            });
        }
    });
});

app.post('/api/product/get-product', function(req, res) {
    const { body } = req;
    const {
        id,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Id invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update profile.'
            });
        } else {
            let getProductById = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            let getProductByIdInserts = [
                config.tables[0].table_name,
                config.tables[0].table_fields[0].Field,
                id,
                config.tables[0].table_fields[3].Field,
                results[0][config.tables[3].table_fields[1].Field],
            ];
            getProductById = mysql.format(getProductById, getProductByIdInserts);
            connection.query(getProductById, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in get product details.'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        image: result[0][config.tables[0].table_fields[6].Field],
                        menu: result[0][config.tables[0].table_fields[8].Field],
                        name: result[0][config.tables[0].table_fields[4].Field],
                        sku: result[0][config.tables[0].table_fields[11].Field],
                        price: result[0][config.tables[0].table_fields[7].Field],
                        stock: result[0][config.tables[0].table_fields[9].Field],
                        ifmanaged: result[0][config.tables[0].table_fields[10].Field],
                        description: result[0][config.tables[0].table_fields[5].Field]
                    });
                }
            });
        }
    });
});


app.post('/api/database/pagination', function(req, res) {
    const { body } = req;
    const {
        db,
        perPage,
        token
    } = body;

    if(!db || !config.patterns.names.test(db)) {
        return res.send({
            success: false,
            message: 'Database invalid or cannot be left empty.'
        });
    }

    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }

    let database = ''; let unitId = '';
    switch(db) {
        case 'products': 
            database = config.tables[0].table_name;
            unitId = config.tables[0].table_fields[0].Field;
            break;
        case 'userroles':
            database = config.tables[1].table_name;
            unitId = config.tables[1].table_fields[0].Field;
            break;
        case 'users':
            database = config.tables[2].table_name;
            unitId = config.tables[2].table_fields[0].Field;
            break;
        case 'usersessions':
            database = config.tables[3].table_name;
            unitId = config.tables[3].table_fields[0].Field;
            break;
        case 'paypal':
            database = config.tables[4].table_name;
            unitId = config.tables[4].table_fields[0].Field;
            break;
        case 'orders':
            database = config.tables[5].table_name;
            unitId = config.tables[5].table_fields[0].Field;
            if(token) {
                let user = config.tables[5].table_fields[1].Field;
                if(!config.patterns.numbers.test(token)) {
                    return res.send({
                        success: false,
                        message: 'Token invalid or cannot be left empty.'
                    });
                } else {
                    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
                    let userIdInserts = [
                        config.tables[3].table_fields[1].Field,
                        config.tables[3].table_name,
                        config.tables[3].table_fields[0].Field,
                        token
                    ];
                    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
                    connection.query(getUserIdSession, function (error, results, fields) {
                        if(error) {
                            return res.send({
                                success: false,
                                message: 'Server Error in get userid.'
                            });
                        } else {
                            let countDatabaseRows = "SELECT COUNT(??) FROM ?? WHERE ?? = ?";
                            let countDatabaseRowsInserts = [
                                unitId,
                                database,
                                user,
                                results[0][config.tables[3].table_fields[1].Field]
                            ];
                            countDatabaseRows = mysql.format(countDatabaseRows, countDatabaseRowsInserts);
                            connection.query(countDatabaseRows, function (error, results, fields) {
                                if(error) {
                                    return res.send({
                                        success: false,
                                        message: 'Server Error in count corders for pagination.'
                                    });
                                } else {
                                    let pages = Math.ceil(results[0]['COUNT(`' + unitId + '`)'] / perPage);
                                    return res.send({
                                        success: true,
                                        message: 'Success',
                                        pages: pages
                                    });
                                }
                            });
                        }
                    });
                }
            }
            break;
        case 'newsletter':
            database = config.tables[6].table_name;
            unitId = config.tables[6].table_fields[0].Field;
            break;
        case 'frontmenu':
            database = config.tables[7].table_name;
            unitId = config.tables[7].table_fields[0].Field;
            break;
        default: database = ''; unitId = ''; break;
    }
    if(!token) {
        let countDatabaseRows = "SELECT COUNT(??) FROM ??";
        let countDatabaseRowsInserts = [
            unitId,
            database
        ];
        countDatabaseRows = mysql.format(countDatabaseRows, countDatabaseRowsInserts);
        connection.query(countDatabaseRows, function (error, results, fields) {
            if(error) {
                return res.send({
                    success: false,
                    message: 'Server Error in count products for pagination.'
                });
            } else {
                let pages = Math.ceil(results[0]['COUNT(`' + unitId + '`)'] / perPage);
                return res.send({
                    success: true,
                    message: 'Success',
                    pages: pages
                });
            }
        });
    }
});

app.post('/api/product/delete-product', function(req, res) {
    const { body } = req;
    const {
        id,
        token
    } = body;

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in check userid delete product.'
            });
        } else {
            let getProductToDeleteById = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            let getProductToDeleteByIdInserts = [
                config.tables[0].table_name,
                config.tables[0].table_fields[0].Field,
                id,
                config.tables[0].table_fields[3].Field,
                results[0][config.tables[3].table_fields[1].Field],
            ];
            getProductToDeleteById = mysql.format(getProductToDeleteById, getProductToDeleteByIdInserts);
            connection.query(getProductToDeleteById, function (error, results, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in get product by id to delete.'
                    });
                } else {
                    if(urlExists(imagePath + `/img/products/${results[0][config.tables[0].table_fields[6].Field]}`)) {
                        fs.unlink(imagePath + `/img/products/${results[0][config.tables[0].table_fields[6].Field]}`, (err) => {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in delete product image.'
                                });
                            } else {
                                let deleteProduct = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                                let deleteProductInserts = [
                                    config.tables[0].table_name,
                                    config.tables[0].table_fields[0].Field,
                                    id,
                                    config.tables[0].table_fields[3].Field,
                                    results[0][config.tables[3].table_fields[1].Field],
                                ];
                                deleteProduct = mysql.format(deleteProduct, deleteProductInserts);
                                connection.query(deleteProduct, function (error, result, fields) {
                                    if(error) {
                                        return res.send({
                                            success: false,
                                            message: 'Server Error in delete product row.'
                                        });
                                    } else {
                                        return res.send({
                                            success: true,
                                            message: 'Success'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        let deleteProduct = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                        let deleteProductInserts = [
                            config.tables[0].table_name,
                            config.tables[0].table_fields[0].Field,
                            id,
                            config.tables[0].table_fields[3].Field,
                            results[0][config.tables[3].table_fields[1].Field],
                        ];
                        deleteProduct = mysql.format(deleteProduct, deleteProductInserts);
                        connection.query(deleteProduct, function (error, result, fields) {
                            if(error) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in delete product row.'
                                });
                            } else {
                                return res.send({
                                    success: true,
                                    message: 'Success'
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

app.post('/api/product/front', function(req, res) {
    const { body } = req;
    const {
        perPage,
        currentPage,
        searchString
    } = body;
    
    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }
    if(!currentPage || !config.patterns.numbers.test(currentPage)) {
        return res.send({
            success: false,
            message: 'Current page name invalid or cannot be left empty.'
        });
    }
    if(!searchString || !config.patterns.names.test(searchString)) {
        return res.send({
            success: false,
            message: 'search string invalid or cannot be left empty.'
        });
    }

    let countFrontProducts = "SELECT COUNT(??) FROM ??";
    let countFrontProductsInserts = [
        config.tables[0].table_fields[0].Field,
        config.tables[0].table_name
    ];
    countFrontProducts = mysql.format(countFrontProducts, countFrontProductsInserts);
    connection.query(countFrontProducts, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in count products.'
            });
        } else {
            let start = (currentPage-1)*perPage;
            let getFrontProducts = '';
            let getFrontProductInserts = [];
            if(searchString == "all") {
                getFrontProducts = "SELECT * FROM ?? ORDER BY ?? DESC LIMIT ?, ?";
                getFrontProductInserts.push(
                    config.tables[0].table_name,
                    config.tables[0].table_fields[7].Field,
                    start, perPage
                );
            } else {
                let stringParamas = searchString.split(" ");
                getFrontProducts = "SELECT * FROM ?? WHERE "
                getFrontProductInserts.push(config.tables[0].table_name);
                for(let i=0; i<stringParamas.length; i++) {
                    getFrontProductInserts.push(config.tables[0].table_fields[12].Field);
                    if(i == stringParamas.length - 1) getFrontProducts += `?? LIKE '%${stringParamas[i].toLowerCase()}%' `;
                    else getFrontProducts += `?? LIKE '%${stringParamas[i].toLowerCase()}%' OR `;
                }
                getFrontProductInserts.push(config.tables[0].table_fields[7].Field, start, perPage);
                getFrontProducts += "ORDER BY ?? DESC LIMIT ?, ?";
            }
            getFrontProducts = mysql.format(getFrontProducts, getFrontProductInserts);
            connection.query(getFrontProducts, function (err, result, fields) {
                if(err) {
                    return res.send({
                        success: false,
                        message: 'Server Error in product upload'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        products: result
                    });
                }
            });
        }
    });
});

app.post('/api/product/upload', function(req, res) {
    const { body } = req;
    const {
        filename,
        menu,
        name,
        sku,
        price,
        stock,
        ifmanaged,
        description,
        token
    } = body;
    
    if (!req.files) {
        return res.send({
            success: false,
            message: 'No file was uploaded.'
        });
    }
    
    if(!validateImageUpload(req.files)) {
        return res.send({
            success: false,
            message: 'File is invalid.'
        });
    }

    if(!filename || !config.patterns.names.test(filename)) {
        return res.send({
            success: false,
            message: 'Image name invalid or cannot be left empty.'
        });
    }

    if(!menu || !config.patterns.names.test(menu)) {
        return res.send({
            success: false,
            message: 'Product menu invalid or cannot be left empty.'
        });
    }

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
            success: false,
            message: 'Product name invalid or cannot be left empty.'
        });
    }

    if(!description || !config.patterns.names.test(description)) {
        return res.send({
            success: false,
            message: 'Description invalid or cannot be left empty.'
        });
    }

    if(!stock || !config.patterns.numbers.test(stock)) {
        return res.send({
            success: false,
            message: 'Stock invalid or cannot be left empty.'
        });
    }

    if(!ifmanaged || !config.patterns.numbers.test(ifmanaged)) {
        return res.send({
            success: false,
            message: 'Price invalid or cannot be left empty.'
        });
    }

    if(!price || !config.patterns.names.test(price)) {
        return res.send({
            success: false,
            message: 'Price invalid or cannot be left empty.'
        });
    }

    if(!sku || !config.patterns.names.test(sku)) {
        return res.send({
            success: false,
            message: 'Sku invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.names.test(token)) {
        return res.send({
            success: false,
            message: 'Invalid token.'
        });
    }

    let metta = name.toLowerCase() + " " + menu.toLowerCase() + " " + price.toLowerCase() + " " + sku.toLowerCase() + " " + description.toLowerCase();

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid.'
            });
        } else {
            let getLastProductId = "SELECT MAX(??) FROM ??";
            let getLastProductIdInserts = [
                config.tables[0].table_fields[0].Field,
                config.tables[0].table_name
            ];
            getLastProductId = mysql.format(getLastProductId, getLastProductIdInserts);
            connection.query(getLastProductId, function (error, maxIdResults, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in get last order id'
                    });
                } else {
                    let newProductid = maxIdResults[0]['MAX(`' + config.tables[0].table_fields[0].Field + '`)'] + 1;
                    let ext = '';
                    var splitRes = req.files.file.mimetype.split("/");
                    switch(splitRes[1]) {
                        case 'jpeg': ext = '.jpg'; break;
                        case 'jpg': ext = '.jpg'; break;
                        case 'png': ext = '.png'; break;
                        case 'gif': ext = '.gif'; break;
                    }
                    let imageFile = req.files['file'];
                    let image = req.body.filename + "-" + newProductid + ext;
                    //console.log(image);
                    imageFile.mv(imagePath + `/img/products/${req.body.filename}-${newProductid}${ext}`,
                    function(err) {
                        if (err) {
                            return res.send({
                                success: false,
                                message: 'Server error uploading image.'
                            });
                        } else {
                            var insertProduct = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            var insertProductInserts = [
                                config.tables[0].table_name,
                                myDate, myDate, results[0][config.tables[3].table_fields[1].Field], name,
                                description, image, price, menu, stock, ifmanaged, sku, metta
                            ];
                            insertProduct = mysql.format(insertProduct, insertProductInserts);
                            //console.log(insertProduct);
                            connection.query(insertProduct, function (error, result, fields) {
                                if(error) {
                                    return res.send({
                                        success: false,
                                        message: 'Server Error in product upload'
                                    });
                                } else {
                                    return res.send({
                                        success: true,
                                        message: 'Your Product has been successfully uploaded.',
                                        id: result.insertId,
                                        menu: menu,
                                        name: name,
                                        description: description,
                                        price: price,
                                        stock: stock,
                                        ifmanaged: ifmanaged,
                                        sku: sku,
                                        image: image
                                    });
                                }
                            });    
                        }
                    });
                }
            });
        }
    });
});

app.post('/api/product/update', function(req, res) {
    const { body } = req;
    const {
        proid,
        filename,
        menu,
        name,
        sku,
        description,
        price,
        stock,
        ifmanaged,
        imagename,
        token
    } = body;
    let updateObj = [];

    if(!proid || !config.patterns.numbers.test(proid)) {
        return res.send({
            success: false,
            message: 'Product id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(config.patterns.names.test(name)) {
        updateObj.push({
            name: config.tables[0].table_fields[4].Field,
            content: name
        });
    } else {
        if(name != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.names.test(description)) {
        updateObj.push({
            name: config.tables[0].table_fields[5].Field,
            content: description
        });
    } else {
        if(description != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.names.test(price)) {
        updateObj.push({
            name: config.tables[0].table_fields[7].Field,
            content: price
        });
    } else {
        if(price != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.names.test(menu)) {
        updateObj.push({
            name: config.tables[0].table_fields[8].Field,
            content: menu
        });
    } else {
        if(menu != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(stock)) {
        updateObj.push({
            name: config.tables[0].table_fields[9].Field,
            content: stock
        });
    } else {
        if(stock != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(ifmanaged)) {
        updateObj.push({
            name: config.tables[0].table_fields[10].Field,
            content: ifmanaged
        });
    } else {
        if(ifmanaged != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.names.test(sku)) {
        updateObj.push({
            name: config.tables[0].table_fields[11].Field,
            content: sku
        });
    } else {
        if(sku != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }
    
    if (req.files) {
        if(!filename || !config.patterns.names.test(filename)) {
            return res.send({
                success: false,
                message: 'Filename empty or Letters Numbers Spaces _ - and . allowed.'
            });
        }

        let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
        let userIdInserts = [
            config.tables[3].table_fields[1].Field,
            config.tables[3].table_name,
            config.tables[3].table_fields[0].Field,
            token
        ];
        getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
        connection.query(getUserIdSession, function (error, results, fields) {
            if(error) {
                return res.send({
                    success: false,
                    message: 'Server Error in get userid.'
                });
            } else {
                if(config.patterns.names.test(imagename)) {
                    if(urlExists(imagePath + `/img/products/${imagename}`)) {
                        fs.unlink(imagePath + `/img/products/${imagename}`, (err) => {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in delete product image update product.'
                                });
                            } else {
                                let ext = '';
                                var splitRes = req.files.file.mimetype.split("/");
                                switch(splitRes[1]) {
                                    case 'jpeg': ext = '.jpg'; break;
                                    case 'jpg': ext = '.jpg'; break;
                                    case 'png': ext = '.png'; break;
                                    case 'gif': ext = '.gif'; break;
                                }
                                
                                let image = req.body.filename + "-" + proid + ext;
                                if(config.patterns.names.test(image)) updateObj.push({
                                    name: config.tables[0].table_fields[6].Field,
                                    content: image
                                });

                                let imageFile = req.files['file'];
                                imageFile.mv(imagePath + `/img/products/${req.body.filename}-${proid}${ext}`,
                                    function(err) {
                                        if (err) {
                                            return res.send({
                                                success: false,
                                                message: 'Server error uploading image.'
                                            });
                                        } else {
                                            var updateProduct = "UPDATE ?? SET ";
                                            var updateProductInserts = [
                                                config.tables[0].table_name
                                            ];
                                            let objCount=0;
                                            updateObj.forEach(element => {
                                                if(updateObj.length - 1 == objCount) updateProduct += "?? = ? ";
                                                else updateProduct += "?? = ?, ";
                                                updateProductInserts.push(element.name);
                                                updateProductInserts.push(element.content);
                                                objCount++;
                                            });
                                            updateProduct += `WHERE ?? = ${proid} AND ?? = ${results[0][config.tables[3].table_fields[1].Field]}`;
                                            updateProductInserts.push(config.tables[0].table_fields[0].Field);
                                            updateProductInserts.push(config.tables[0].table_fields[3].Field);
                                            
                                            updateProduct = mysql.format(updateProduct, updateProductInserts);
                                            connection.query(updateProduct, function (error, result, fields) {
                                                if(error) {
                                                    return res.send({
                                                        success: false,
                                                        message: 'Server Error in product update'
                                                    });
                                                } else {
                                                    return res.send({
                                                        success: true,
                                                        message: 'Your Product has been successfully updated.',
                                                        id: result.insertId,
                                                        menu: menu,
                                                        name: name,
                                                        description: description,
                                                        price: price,
                                                        stock: stock,
                                                        ifmanaged: ifmanaged,
                                                        sku: sku,
                                                        image: image
                                                    });
                                                }
                                            });    
                                        }
                                });
                            }
                        });
                    } else {
                        return res.send({
                            success: false,
                            message: 'The Image does not exsist. Please delete the product and try again.'
                        });
                    }
                }
            }
        });
    } else {
        let image = '';
        let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
        let userIdInserts = [
            config.tables[3].table_fields[1].Field,
            config.tables[3].table_name,
            config.tables[3].table_fields[0].Field,
            token
        ];
        getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
        connection.query(getUserIdSession, function (error, results, fields) {
            if(error) {
                return res.send({
                    success: false,
                    message: 'Server Error in get userid no image.'
                });
            } else {
                var updateProduct = "UPDATE ?? SET ";
                var updateProductInserts = [
                    config.tables[0].table_name
                ];
                let objCount=0;
                updateObj.forEach(element => {
                    if(updateObj.length - 1 == objCount) updateProduct += "?? = ? ";
                    else updateProduct += "?? = ?, ";
                    updateProductInserts.push(element.name);
                    updateProductInserts.push(element.content);
                    objCount++;
                });
                updateProduct += `WHERE ?? = ${proid} AND ?? = ${results[0][config.tables[3].table_fields[1].Field]}`;
                updateProductInserts.push(config.tables[0].table_fields[0].Field);
                updateProductInserts.push(config.tables[0].table_fields[3].Field);
                
                updateProduct = mysql.format(updateProduct, updateProductInserts);
                console.log(updateProduct);
                connection.query(updateProduct, function (error, result, fields) {
                    if(error) {
                        return res.send({
                            success: false,
                            message: 'Server Error in product update no image'
                        });
                    } else {
                        return res.send({
                            success: true,
                            message: 'Your Product has been successfully updated.',
                            id: proid,
                            menu: menu,
                            name: name,
                            description: description,
                            price: price,
                            stock: stock,
                            ifmanaged: ifmanaged,
                            sku: sku,
                            image: image
                        });
                    }
                });
            }
        });
    }
});

/*
 ********************** Profile Upload && Update ***********************
 ***********************************************************************
 */

app.post('/api/avatar/get-avatar', function(req, res) {
    const { body } = req;
    const {
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Invalid token.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid update avatar.'
            });
        } else {
            let getUserAvatar = "SELECT * FROM ?? WHERE ?? = ?";
            let getUserAvatarInserts = [
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                results[0][config.tables[3].table_fields[1].Field]
            ];
            getUserAvatar = mysql.format(getUserAvatar, getUserAvatarInserts);
            connection.query(getUserAvatar, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in get user avatar.'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        id: results[0][config.tables[3].table_fields[1].Field],
                        avatar: result[0][config.tables[2].table_fields[7].Field]
                    });
                }
            });
        }
    });
});

app.post('/api/avatar/update-avatar', function(req, res) {
    const { body } = req;
    const {
        imagename,
        filename,
        token
    } = body;
    
    if (!req.files) {
        return res.send({
            success: false,
            message: 'No file was uploaded.'
        });
    }

    if(!validateImageUpload(req.files)) {
        return res.send({
            success: false,
            message: 'File is invalid.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Invalid token.'
        });
    }

    if(!filename || !config.patterns.names.test(filename)) {
        return res.send({
            success: false,
            message: 'No filename or Letters Numbers Spaces _ - and . allowed.'
        });
    }

    if(!imagename || !config.patterns.names.test(imagename)) {
        return res.send({
            success: false,
            message: 'No Imagename or Letters Numbers Spaces _ - and . allowed.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid update avatar.'
            });
        } else {
            if(urlExists(imagePath + `/img/avatar/${uniqueId(results[0][config.tables[3].table_fields[1].Field])}/${imagename}`)) {
                fs.unlink(imagePath + `/img/avatar/${uniqueId(results[0][config.tables[3].table_fields[1].Field])}/${imagename}`, (err) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Server Error in delete product image update product.'
                        });
                    } else {
                        let ext = '';
                        var splitRes = req.files.file.mimetype.split("/");
                        switch(splitRes[1]) {
                            case 'jpeg': ext = '.jpg'; break;
                            case 'jpg': ext = '.jpg'; break;
                            case 'png': ext = '.png'; break;
                            case 'gif': ext = '.gif'; break;
                        }
                        
                        let image = req.body.filename + ext;
                        let imageFile = req.files['file'];
                        imageFile.mv(imagePath + `/img/avatar/${uniqueId(results[0][config.tables[3].table_fields[1].Field])}/${req.body.filename}${ext}`,
                            function(err) {
                                if (err) {
                                    return res.send({
                                        success: false,
                                        message: 'Server error updating avatar.'
                                    });
                                } else {
                                    var updateAvatar = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                                    var updateAvatarInserts = [
                                        config.tables[2].table_name,
                                        config.tables[2].table_fields[7].Field,
                                        image,
                                        config.tables[2].table_fields[0].Field,
                                        results[0][config.tables[3].table_fields[1].Field]
                                    ];
                                    updateAvatar = mysql.format(updateAvatar, updateAvatarInserts);
                                    connection.query(updateAvatar, function (error, result, fields) {
                                        if(error) {
                                            return res.send({
                                                success: false,
                                                message: 'Server Error in avatar update'
                                            });
                                        } else {
                                            return res.send({
                                                success: true,
                                                message: 'Your Avatar has been successfully updated.',
                                                avatar: image,
                                                userid: results[0][config.tables[3].table_fields[1].Field]
                                            });
                                        }
                                    });    
                                }
                        });
                    }
                });
            } else {
                return res.send({
                    success: false,
                    message: 'The Image does not exsist. Please delete the product and try again.'
                });
            }
        }
    });
});

app.post('/api/account/get-account', function(req, res) {
    const { body } = req;
    const {
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update profile.'
            });
        } else {
            let getUserDetails = "SELECT * FROM ?? WHERE ?? = ?";
            let getUserDetailsInserts = [
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                results[0][config.tables[3].table_fields[1].Field]
            ];
            getUserDetails = mysql.format(getUserDetails, getUserDetailsInserts);
            connection.query(getUserDetails, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in get userid details.'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        name: result[0][config.tables[2].table_fields[3].Field],
                        email: result[0][config.tables[2].table_fields[4].Field],
                        address: result[0][config.tables[2].table_fields[9].Field],
                        city: result[0][config.tables[2].table_fields[10].Field],
                        state: result[0][config.tables[2].table_fields[11].Field],
                        zip: result[0][config.tables[2].table_fields[12].Field]
                    });
                }
            });
        }
    });
});

app.post('/api/profile/update-profile', function(req, res) {
    const { body } = req;
    const {
        name,
        address,
        city,
        state,
        zip,
        token
    } = body;
    let { email } = body;

    let updateObj = [];

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(config.patterns.names.test(name)) {
        updateObj.push({
            name: config.tables[2].table_fields[3].Field,
            content: name
        });
    } else {
        if(name != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.emails.test(email)) {
        updateObj.push({
            name: config.tables[2].table_fields[4].Field,
            content: email.toLowerCase()
        });
    } else {
        if(email != '') {
            return res.send({
                success: false,
                message: 'Invalid email.'
            });
        }
    }

    if(config.patterns.names.test(address)) {
        updateObj.push({
            name: config.tables[2].table_fields[9].Field,
            content: address
        });
    } else {
        if(address != '') {
            return res.send({
                success: false,
                message: 'Invalid address.'
            });
        }
    }

    if(config.patterns.names.test(city)) {
        updateObj.push({
            name: config.tables[2].table_fields[10].Field,
            content: city
        });
    } else {
        if(city != '') {
            return res.send({
                success: false,
                message: 'Invalid city.'
            });
        }
    }

    if(config.patterns.names.test(state)) {
        updateObj.push({
            name: config.tables[2].table_fields[11].Field,
            content: state
        });
    } else {
        if(state != '') {
            return res.send({
                success: false,
                message: 'Invalid state.'
            });
        }
    }

    if(config.patterns.numbers.test(zip)) {
        updateObj.push({
            name: config.tables[2].table_fields[12].Field,
            content: zip
        });
    } else {
        if(zip != '') {
            return res.send({
                success: false,
                message: 'Invalid zip.'
            });
        }
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update profile.'
            });
        } else {
            let updateProfile = "UPDATE ?? SET ";
            let updateProfileInserts = [
                config.tables[2].table_name
            ];
            let objCount=0;
            updateObj.forEach(element => {
                if(updateObj.length - 1 == objCount) updateProfile += "?? = ? ";
                else updateProfile += "?? = ?, ";
                updateProfileInserts.push(element.name);
                updateProfileInserts.push(element.content);
                objCount++;
            });
            updateProfile += `WHERE ?? = ${results[0][config.tables[3].table_fields[1].Field]}`;
            updateProfileInserts.push(config.tables[2].table_fields[0].Field);

            updateProfile = mysql.format(updateProfile, updateProfileInserts);
            connection.query(updateProfile, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in update profile'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Your profile has been successfully updated.',
                        name: name,
                        email: email,
                        address: address,
                        city: city,
                        state: state,
                        zip: zip
                    });
                }
            });
        }
    });
});

app.post('/api/account/get-paypal', function(req, res) {
    const { body } = req;
    const {
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update profile.'
            });
        } else {
            let getUserDetails = "SELECT * FROM ?? WHERE ?? = ?";
            let getUserDetailsInserts = [
                config.tables[4].table_name,
                config.tables[4].table_fields[1].Field,
                results[0][config.tables[3].table_fields[1].Field]
            ];
            getUserDetails = mysql.format(getUserDetails, getUserDetailsInserts);
            connection.query(getUserDetails, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in get userid details.'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        mode: result[0][config.tables[4].table_fields[4].Field],
                        client: result[0][config.tables[4].table_fields[5].Field],
                        secret: result[0][config.tables[4].table_fields[6].Field]
                    });
                }
            });
        }
    });
});

app.post('/api/profile/update-paypal', function(req, res) {
    const { body } = req;
    const {
        mode,
        client,
        secret,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!mode || !config.patterns.names.test(mode)) {
        return res.send({
            success: false,
            message: 'Paypal mode invalid or cannot be left empty.'
        });
    }

    if(!client || !config.patterns.names.test(client)) {
        return res.send({
            success: false,
            message: 'Paypal client invalid or cannot be left empty.'
        });
    }

    if(!secret || !config.patterns.names.test(secret)) {
        return res.send({
            success: false,
            message: 'Paypal secret invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update paypal.'
            });
        } else {
            let updatePaypal = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?  WHERE ?? = ?";
            let updatePaypalInserts = [
                config.tables[4].table_name,
                config.tables[4].table_fields[4].Field,
                mode,
                config.tables[4].table_fields[5].Field,
                client,
                config.tables[4].table_fields[6].Field,
                secret,
                config.tables[4].table_fields[1].Field,
                results[0][config.tables[3].table_fields[1].Field]
            ];

            updatePaypal = mysql.format(updatePaypal, updatePaypalInserts);
            connection.query(updatePaypal, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in update profile'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Your paypal profile has been successfully updated.'
                    });
                }
            });
        }
    });
});

app.post('/api/profile/update-password', function(req, res) {
    const { body } = req;
    const {
        password,
        repassword,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!password || !config.patterns.passwords.test(password)) {
        return res.send({
            success: false,
            message: 'Password invalid or cannot be left empty.'
        });
    }

    if(!repassword || !config.patterns.passwords.test(repassword)) {
        return res.send({
            success: false,
            message: 'Repassword or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update password.'
            });
        } else {
            if(password != repassword) {
                return res.send({
                    success: false,
                    message: 'Passwords do not match update password.'
                });
            } else {
                let updatePassword = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                let updatePasswordInserts = [
                    config.tables[2].table_name,
                    config.tables[2].table_fields[5].Field,
                    generateHash(password),
                    config.tables[2].table_fields[0].Field,
                    results[0][config.tables[3].table_fields[1].Field]
                ];

                updatePassword = mysql.format(updatePassword, updatePasswordInserts);
                connection.query(updatePassword, function (error, result, fields) {
                    if(error) {
                        return res.send({
                            success: false,
                            message: 'Server error in update profile'
                        });
                    } else {
                        return res.send({
                            success: true,
                            message: 'Your password has been successfully updated.'
                        });
                    }
                });
            }
        }
    });
});

app.post('/api/account/get-visibility', function(req, res) {
    const { body } = req;
    const {
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid get visibility.'
            });
        } else {
            let getVisibility = "SELECT ?? FROM ?? WHERE ?? = ?";
            let getVisibilityInserts = [
                config.tables[2].table_fields[8].Field,
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                results[0][config.tables[3].table_fields[1].Field]
            ];

            getVisibility = mysql.format(getVisibility, getVisibilityInserts);
            connection.query(getVisibility, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in get visibility'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        visibility: result[0][config.tables[2].table_fields[8].Field]
                    });
                }
            });
        }
    });
});

app.post('/api/profile/update-visibility', function(req, res) {
    const { body } = req;
    const {
        visibility,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!visibility || !config.patterns.numbers.test(visibility)) {
        return res.send({
            success: false,
            message: 'Visibility invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update visibility.'
            });
        } else {
            let updateVisibility = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            let updateVisibilityInserts = [
                config.tables[2].table_name,
                config.tables[2].table_fields[8].Field,
                visibility,
                config.tables[2].table_fields[0].Field,
                results[0][config.tables[3].table_fields[1].Field]
            ];

            updateVisibility = mysql.format(updateVisibility, updateVisibilityInserts);
            connection.query(updateVisibility, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in update visibility'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Your visibility has been successfully updated.',
                        visibility: visibility
                    });
                }
            });
        }
    });
});

/*
 ************************** Newsletter Signup **************************
 ***********************************************************************
 */

app.post('/api/newsletter/registration', function(req, res) {
    const { body } = req;
    const {
        name
    } = body;
    let { email } = body;

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
            success: false,
            message: 'Letters Numbers Spaces _ - and . allowed.'
        });
    }

    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
            success: false,
            message: 'Email invalid or cannot be left empty.'
        });
    }

    let insertNewsletter = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?)";
    let insertNewsletterInserts = [
        config.tables[6].table_name,
        myDate, myDate, name, email,

    ];
    insertNewsletter = mysql.format(insertNewsletter, insertNewsletterInserts);
    connection.query(insertNewsletter, function (error, result, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in register for newsletter'
            });
        } else {
            return res.send({
                success: true,
                message: 'You successfully registered for our newsletter.'
            });
        }
    });
});

/*
 *************************** Cart && Paypal ****************************
 ***********************************************************************
 */

app.post('/api/cart/call-paypal', function(req, res) {
    const { body } = req;
    const {
        name,
        address,
        city,
        state,
        zip,
        proids,
        numofs,
        prices,
        items,
        total
    } = body;
    let { email } = body;

    let itemIds = [];
    let productItems = items.split("&");
    productItems.forEach(item => {
        let itemParts = item.split("_");
        if(!itemParts[0] || !config.patterns.numbers.test(itemParts[0])) {
            return res.send({
                success: false,
                message: 'Empty id or Numbers only.'
            });
        }
        if(!itemParts[1] || !config.patterns.numbers.test(itemParts[1])) {
            return res.send({
                success: false,
                message: 'Empty quantity or Numbers only.'
            });
        }
        itemIds.push({ id: itemParts[0], quantity: itemParts[1] });
    });

    if(!proids || !config.patterns.names.test(proids)) {
        return res.send({
            success: false,
            message: 'Invalid proids Letters Numbers Spaces _ - and . allowed or proids is empty.'
        });
    }

    if(!numofs || !config.patterns.names.test(numofs)) {
        return res.send({
            success: false,
            message: 'Invalid quantiy Letters Numbers Spaces _ - and . allowed or quantiy is empty.'
        });
    }

    if(!prices || !config.patterns.names.test(prices)) {
        return res.send({
            success: false,
            message: 'Invalid prices Letters Numbers Spaces _ - and . allowed or prices is empty.'
        });
    }

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
            success: false,
            message: 'Invalid name Letters Numbers Spaces _ - and . allowed or name is empty.'
        });
    }

    if(!address || !config.patterns.names.test(address)) {
        return res.send({
            success: false,
            message: 'Invalid address Letters Numbers Spaces _ - and . allowed or address is empty.'
        });
    }

    if(!city || !config.patterns.names.test(city)) {
        return res.send({
            success: false,
            message: 'Invalid city Letters Numbers Spaces _ - and . allowed or city is empty.'
        });
    }

    if(!state || !config.patterns.names.test(state)) {
        return res.send({
            success: false,
            message: 'Invalid state Letters Numbers Spaces _ - and . allowed or state is empty.'
        });
    }

    if(!zip || !config.patterns.numbers.test(zip)) {
        return res.send({
            success: false,
            message: 'Invalid zip numbers only or zip is empty.'
        });
    }

    if(!total || !config.patterns.names.test(total)) {
        return res.send({
            success: false,
            message: 'Invalid address Letters Numbers Spaces _ - and . allowed or total is empty.'
        });
    }

    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
            success: false,
            message: 'Invalid email or email is empty.'
        });
    }

    let loadCredentials = "SELECT * FROM ?? LIMIT 1";
    let loadCredentialsInserts = [
        config.tables[4].table_name
    ];
    loadCredentials = mysql.format(loadCredentials, loadCredentialsInserts);
    connection.query(loadCredentials, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in load credentials call paypal.'
            });
        } else {
            paypal.configure({
                "mode": results[0][config.tables[4].table_fields[4].Field],
                "client_id": results[0][config.tables[4].table_fields[5].Field],
                "client_secret": results[0][config.tables[4].table_fields[6].Field]
            });

            let loadProducts = "SELECT * FROM ??";
            let loadProductsInserts = [
                config.tables[0].table_name
            ];
            loadProducts = mysql.format(loadProducts, loadProductsInserts);
            connection.query(loadProducts, function (error, results, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in load products call paypal.'
                    });
                } else {
                    let objCount = 0;
                    let paypalItems = []; let itemsString = '';
                    itemIds.forEach(itemObj => {
                        results.forEach(product => {
                            if(parseInt(itemObj.id) == product[config.tables[0].table_fields[0].Field]) {
                                paypalItems.push({
                                    "name": product[config.tables[0].table_fields[4].Field],
                                    "sku": product[config.tables[0].table_fields[11].Field],
                                    "price": product[config.tables[0].table_fields[7].Field],
                                    "currency": "USD",
                                    "quantity": parseInt(itemObj.quantity),
                                });
                                if(objCount == itemIds.length - 1) itemsString += product[config.tables[0].table_fields[0].Field] + "_" + product[config.tables[0].table_fields[4].Field] + "_" + product[config.tables[0].table_fields[11].Field] + "_" + product[config.tables[0].table_fields[7].Field] + "_" + itemObj.quantity + "_" + product[config.tables[0].table_fields[6].Field] + "_" + product[config.tables[0].table_fields[9].Field] + "_" + (parseInt(itemObj.quantity) * parseFloat(product[config.tables[0].table_fields[7].Field])).toFixed(2) + "_" + product[config.tables[0].table_fields[10].Field];
                                else itemsString += "&" + product[config.tables[0].table_fields[0].Field] + "_" + product[config.tables[0].table_fields[4].Field] + "_" + product[config.tables[0].table_fields[11].Field] + "_" + product[config.tables[0].table_fields[7].Field] + "_" + itemObj.quantity + "_" + product[config.tables[0].table_fields[6].Field] + "_" + product[config.tables[0].table_fields[9].Field] + "_" + (parseInt(itemObj.quantity) * parseFloat(product[config.tables[0].table_fields[7].Field])).toFixed(2) + "_" + product[config.tables[0].table_fields[10].Field];
                                objCount++;
                            }
                        });
                    });
                    let getLastOrderId = "SELECT MAX(??) FROM ??";
                    let getLastOrderIdInserts = [
                        config.tables[5].table_fields[0].Field,
                        config.tables[5].table_name
                    ];
                    getLastOrderId = mysql.format(getLastOrderId, getLastOrderIdInserts);
                    connection.query(getLastOrderId, function (error, maxIdResults, fields) {
                        if(error) {
                            return res.send({
                                success: false,
                                message: 'Server Error in get last order id'
                            });
                        } else {
                            let newTransid = maxIdResults[0]['MAX(`' + config.tables[5].table_fields[0].Field + '`)'] + 1;
                            // "http://localhost:3000" urlConfig.site_url
                            let cancelUrl = urlConfig.site_url + config.paypal_urls.cancel + '/' + newTransid;
                            let successUrl = urlConfig.site_url + config.paypal_urls.success;
                            let create_payment_json = {
                                "intent": "sale",
                                "payer": {
                                    "payment_method": "paypal"
                                },
                                "redirect_urls": {
                                    "return_url": successUrl,
                                    "cancel_url": cancelUrl
                                },
                                "transactions": [
                                    {
                                        "item_list": {
                                            "items": paypalItems
                                        },
                                        "amount": {
                                            "currency": "USD",
                                            "total": total
                                        },
                                        "description": "This is the payment description."
                                    }
                                ]
                            };
                            paypal.payment.create(create_payment_json, function (error, payment) {
                                if (error) {
                                    return res.send({
                                        success: false,
                                        message: 'Error: You most likely forgot to upload your Paypal client id and secret or: ' + error
                                    });
                                } else {
                                    
                                    let insertOrder = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '', ?)";
                                    let insertOrderInserts = [
                                        config.tables[5].table_name, results[0][config.tables[0].table_fields[3].Field],
                                        myDate, myDate, name, email, address, city, state, zip,
                                        proids, numofs, prices, payment.id, itemsString
                                    ];
                                    insertOrder = mysql.format(insertOrder, insertOrderInserts);
                                    connection.query(insertOrder, function (error, result, fields) {
                                        if(error) {
                                            return res.send({
                                                success: false,
                                                message: 'Server Error in insert order call paypal.'
                                            });
                                        } else {
                                            for(let i=0; i<payment.links.length; i++) {
                                                if(payment.links[i].rel === 'approval_url') {
                                                    return res.send({
                                                        success: true,
                                                        url: payment.links[i].href
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/api/paypal/success', function(req, res) {
    const { body } = req;
    const {
        payerId,
        paymentId
    } = body;

    if(!payerId || !config.patterns.names.test(payerId)) {
        return res.send({
            success: false,
            message: 'Invalid payerId or payerId is empty.'
        });
    }

    if(!paymentId || !config.patterns.names.test(paymentId)) {
        return res.send({
            success: false,
            message: 'Invalid paymentId or paymentId is empty.'
        });
    }

    let loadOrder = "SELECT * FROM ?? WHERE ?? = ?";
    let loadOrderInserts = [
        config.tables[5].table_name,
        config.tables[5].table_fields[13].Field,
        paymentId
    ];
    loadOrder = mysql.format(loadOrder, loadOrderInserts);
    connection.query(loadOrder, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in Paypal /success loadOrder'
            });
        } else {
            let proids = results[0][config.tables[5].table_fields[10].Field].split("_");
            let numofs = results[0][config.tables[5].table_fields[11].Field].split("_");
            let price = results[0][config.tables[5].table_fields[12].Field].split("_");
            let total = 0;
            for(let i=0; i<price.length; i++) {
                total += numofs[i] * price[i];
            }

            var execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": total.toFixed(2)
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    for(let i=0; i<proids.length; i++) {
                        let getProductItem = "SELECT * FROM ?? WHERE ?? = ?";
                        let getProductItemInserts = [
                            config.tables[0].table_name,
                            config.tables[0].table_fields[0].Field,
                            proids[i]
                        ];
                        getProductItem = mysql.format(getProductItem, getProductItemInserts);
                        connection.query(getProductItem, function (error, getProductResults, fields) {
                            if(error) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in Paypal /success update product, No item in database'
                                });
                            } else {
                                if(getProductResults[0][config.tables[0].table_fields[10].Field] == 1) {
                                    let newStock = parseInt(getProductResults[0][config.tables[0].table_fields[9].Field]) - parseInt(numofs[i]);
                                    let updateProductStock = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                                    let updateProductStockInserts = [
                                        config.tables[0].table_name,
                                        config.tables[0].table_fields[9].Field,
                                        newStock,
                                        config.tables[0].table_fields[0].Field,
                                        proids[i]
                                    ];
                                    updateProductStock = mysql.format(updateProductStock, updateProductStockInserts);
                                    connection.query(updateProductStock, function (error, updateProductResults, fields) {
                                        if(error) {
                                            return res.send({
                                                success: false,
                                                message: 'Server Error in Paypal /success update product, Error in update product stock item'
                                            });
                                        } else {
                                            console.log("Product stock item: " + proids[i] + " updated successfully");
                                        }
                                    });
                                }
                            }
                        });
                    }
                    let updateOrder = "UPDATE ?? SET ?? = 1 WHERE ?? = ?";
                    let updateOrderInserts = [
                        config.tables[5].table_name,
                        config.tables[5].table_fields[14].Field,
                        config.tables[5].table_fields[13].Field,
                        paymentId
                    ];
                    updateOrder = mysql.format(updateOrder, updateOrderInserts);
                    connection.query(updateOrder, function (error, results, fields) {
                        if(error) {
                            return res.send({
                                success: false,
                                message: 'Server Error in Paypal /success updateOrder'
                            });
                        } else {
                            return res.send({
                                success: true,
                                message: "Success",
                                name: payment.payer.payer_info.shipping_address.recipient_name
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/api/paypal/cancel', function(req, res) {
    const { body } = req;
    const {
        paymentId
    } = body;

    if(!paymentId || !config.patterns.names.test(paymentId)) {
        return res.send({
            success: false,
            message: 'Invalid paymentId or paymentId is empty.'
        });
    }

    let updateOrder = "UPDATE ?? SET ?? = 2 WHERE ?? = ?";
    let updateOrderInserts = [
        config.tables[5].table_name,
        config.tables[5].table_fields[14].Field,
        config.tables[5].table_fields[0].Field,
        paymentId
    ];
    updateOrder = mysql.format(updateOrder, updateOrderInserts);
    connection.query(updateOrder, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in Paypal /cancel loadOrder'
            });
        } else {
            return res.send({
                success: true,
                message: 'Your order has been successfully canceled.'
            });
        }
    });
});

/*
 ***************************** Emailing ********************************
 ***********************************************************************
 */

app.post('/api/contact/request', function(req, res) {
    const { body } = req;
    const {
        name,
        message
    } = body;
    let { email } = body;

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
        success: false,
        message: 'Error: Name cannot be blank'
        });
    }
    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank'
        });
    }
    if(!message || !config.patterns.names.test(message)) {
        return res.send({
        success: false,
        message: 'Error: Message name cannot be blank'
        });
    }
    var mailOptions = {
        from: config.emailer.email,
        to: config.emailer.email,
        subject: 'Contact Request from ' + name + ' @ ' + email,
        text: message
    };
    sendMail(mailOptions);
});

/*
 *************************** User Roles  *******************************
 ***********************************************************************
 */


app.post('/api/roles/delete-user', function(req, res) {
    const { body } = req;
    const {
        id,
        token
    } = body;

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in check userid delete user.'
            });
        } else {
            let getUserToDeleteById = "SELECT * FROM ?? WHERE ?? = ?";
            let getUserToDeleteByIdInserts = [
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                parseInt(id),
            ];
            getUserToDeleteById = mysql.format(getUserToDeleteById, getUserToDeleteByIdInserts);
            connection.query(getUserToDeleteById, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in get user by id to delete.'
                    });
                } else {
                    if(urlExists(imagePath + `/img/avatar/${uniqueId(parseInt(id))}/${result[0][config.tables[2].table_fields[7].Field]}`)) {
                        fs.unlink(imagePath + `/img/avatar/${uniqueId(parseInt(id))}/${result[0][config.tables[2].table_fields[7].Field]}`, (err) => {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in delete user image.'
                                });
                            } else {
                                let deleteUser = "DELETE FROM ?? WHERE ?? = ?";
                                let deleteUserInserts = [
                                    config.tables[2].table_name,
                                    config.tables[2].table_fields[0].Field,
                                    parseInt(id)
                                ];
                                deleteUser = mysql.format(deleteUser, deleteUserInserts);
                                connection.query(deleteUser, function (error, result, fields) {
                                    if(error) {
                                        return res.send({
                                            success: false,
                                            message: 'Server Error in delete user row.'
                                        });
                                    } else {
                                        return res.send({
                                            success: true,
                                            message: 'User has been Successfully deleted.'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        let deleteUser = "DELETE FROM ?? WHERE ?? = ?";
                        let deleteUserInserts = [
                            config.tables[2].table_name,
                            config.tables[2].table_fields[0].Field,
                            parseInt(id)
                        ];
                        deleteUser = mysql.format(deleteUser, deleteUserInserts);
                        connection.query(deleteUser, function (error, result, fields) {
                            if(error) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in delete product row.'
                                });
                            } else {
                                return res.send({
                                    success: true,
                                    message: 'User has been Successfully deleted.'
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

app.post('/api/roles/users', function(req, res) {
    const { body } = req;
    const {
        currentPage,
        perPage,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!currentPage || !config.patterns.numbers.test(currentPage)) {
        return res.send({
            success: false,
            message: 'Current page invalid or cannot be left empty.'
        });
    }

    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid user list roles.'
            });
        } else {
            let start = (currentPage-1)*perPage;
            let userList = "SELECT * FROM ?? ORDER BY ?? DESC LIMIT ?, ?";
            let userListInserts = [
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                start, perPage
            ];
            userList = mysql.format(userList, userListInserts);
            connection.query(userList, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in update profile'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        users: result
                    });
                }
            });
        }
    });
});

app.post('/api/roles/upload', (req, res, next) => {
    const { body } = req;
    const {
        role,
        name,
        password,
        address,
        city,
        state,
        zip,
        ifactive
    } = body;
    let { email } = body;

    if(!role || !config.patterns.numbers.test(role)) {
        return res.send({
        success: false,
        message: 'Error: Role cannot be blank'
        });
    }
    if(!ifactive || !config.patterns.numbers.test(ifactive)) {
        return res.send({
        success: false,
        message: 'Error: Ifactive cannot be blank'
        });
    }
    if(!name || !config.patterns.names.test(name)) {
        return res.send({
        success: false,
        message: 'Error: Name cannot be blank'
        });
    }
    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank'
        });
    }
    if(!password || !config.patterns.passwords.test(password)) {
        return res.send({
        success: false,
        message: 'Error: Password name cannot be blank'
        });
    }
    if(!address || !config.patterns.names.test(address)) {
        return res.send({
        success: false,
        message: 'Error: Address cannot be blank'
        });
    }
    if(!city || !config.patterns.names.test(city)) {
        return res.send({
        success: false,
        message: 'Error: City name cannot be blank'
        });
    }
    if(!state || !config.patterns.names.test(state)) {
        return res.send({
        success: false,
        message: 'Error: State name cannot be blank'
        });
    }
    if(!zip || !config.patterns.numbers.test(zip)) {
        return res.send({
        success: false,
        message: 'Error: State name cannot be blank'
        });
    }

    email = email.toLowerCase();

    let testForExistingUser = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [
        config.tables[2].table_name,
        config.tables[2].table_fields[4].Field, email
    ];
    testForExistingUser = mysql.format(testForExistingUser, inserts);
    connection.query(testForExistingUser, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in check user exsists signup.',
                token: null,
                id: null
            });
        } else {
            if(results.length > 0) {
                return res.send({
                    success: false,
                    message: 'User Exists',
                    token: null,
                    id: null
                });
            } else {
                var insertUserIfNonExists = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                var inserts = [
                    config.tables[2].table_name,
                    myDate, myDate, name, email, generateHash(password),
                    role, 'user-avatar.jpg', ifactive, address, city,
                    state, zip 
                ];
                insertUserIfNonExists = mysql.format(insertUserIfNonExists, inserts);
                connection.query(insertUserIfNonExists, function (err, result, fields) {
                    if(err) {
                        return res.send({
                            success: false,
                            message: 'Server error in register users insert',
                            token: null,
                            id: null
                        });
                    } else {
                        signUpDir = reqPath + '/assets/img/avatar/' + uniqueId(result.insertId);
                        if (fs.existsSync(signUpDir)) {
                            return res.send({
                                success: false,
                                message: 'User avatar folder exist on server.',
                                token: null,
                                id: null
                            });
                        } else {
                            fs.mkdir(signUpDir, function(err, data) {
                                if(err) {
                                    return res.send({
                                        success: false,
                                        message: 'Could not make folder.',
                                        token: null,
                                        id: null
                                    });
                                } else {
                                    fs.readFile(reqPath + '/assets/img/user-avatar.jpg', function (err, imageData) {
                                        if (err) {
                                            return res.send({
                                                success: false,
                                                message: 'Could not read image.',
                                                token: null,
                                                id: null
                                            });
                                        } else {
                                            fs.writeFile(reqPath + '/assets/img/avatar/' + uniqueId(result.insertId) + '/user-avatar.jpg', imageData, function (err) {
                                                if (err) {
                                                    return res.send({
                                                        success: false,
                                                        message: 'Could not write image.',
                                                        token: null,
                                                        id: null
                                                    });
                                                } else {
                                                    var insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                                                    var inserts = [
                                                        config.tables[3].table_name,
                                                        result.insertId, myDate, myDate
                                                    ];
                                                    insertUserSession = mysql.format(insertUserSession, inserts);
                                                    connection.query(insertUserSession, function (error, results, fields) {
                                                        if(error) {
                                                            return res.send({
                                                                success: false,
                                                                message: 'Server error in register session insert',
                                                                token: null,
                                                                id: null
                                                            });
                                                        } else {
                                                            return res.send({
                                                                success: true,
                                                                message: 'Successfull registration',
                                                                token: results.insertId,
                                                                id: result.insertId,
                                                                role: role,
                                                                name: name,
                                                                email: email,
                                                                ifactive: ifactive,
                                                                address: address,
                                                                city: city,
                                                                state: state,
                                                                zip: zip,
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

app.post('/api/roles/user-update', function(req, res) {
    const { body } = req;
    const {
        id,
        filename,
        role,
        name,
        password,
        address,
        city,
        state,
        zip,
        ifactive,
        token
    } = body;
    let { email } = body;
    let updateObj = [];

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'User id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(config.patterns.names.test(name)) {
        updateObj.push({
            name: config.tables[2].table_fields[3].Field,
            content: name
        });
    } else {
        if(name != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.emails.test(email)) {
        updateObj.push({
            name: config.tables[2].table_fields[4].Field,
            content: email
        });
    } else {
        if(email != '') {
            return res.send({
                success: false,
                message: 'Invalid Email.'
            });
        }
    }

    if(config.patterns.passwords.test(password)) {
        updateObj.push({
            name: config.tables[2].table_fields[5].Field,
            content: generateHash(password)
        });
    } else {
        if(password != '') {
            return res.send({
                success: false,
                message: 'Invalid password.'
            });
        }
    }

    if(config.patterns.numbers.test(role)) {
        updateObj.push({
            name: config.tables[2].table_fields[6].Field,
            content: parseInt(role)
        });
    } else {
        if(role != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(ifactive)) {
        updateObj.push({
            name: config.tables[2].table_fields[8].Field,
            content: parseInt(ifactive)
        });
    } else {
        if(ifactive != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    if(config.patterns.names.test(address)) {
        updateObj.push({
            name: config.tables[2].table_fields[9].Field,
            content: address
        });
    } else {
        if(address != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.names.test(city)) {
        updateObj.push({
            name: config.tables[2].table_fields[10].Field,
            content: city
        });
    } else {
        if(city != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.names.test(state)) {
        updateObj.push({
            name: config.tables[2].table_fields[11].Field,
            content: state
        });
    } else {
        if(state != '') {
            return res.send({
                success: false,
                message: 'Letters Numbers Spaces _ - and . allowed.'
            });
        }
    }

    if(config.patterns.numbers.test(zip)) {
        updateObj.push({
            name: config.tables[2].table_fields[12].Field,
            content: parseInt(zip)
        });
    } else {
        if(zip != '') {
            return res.send({
                success: false,
                message: 'Numbers allowed.'
            });
        }
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid roles update user.'
            });
        } else {
            let getUserImage = "SELECT ?? FROM ?? WHERE ?? = ?";
            let getUserImageInserts = [
                config.tables[2].table_fields[7].Field,
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                parseInt(id)
            ];
            getUserImage = mysql.format(getUserImage, getUserImageInserts);
            connection.query(getUserImage, function (error, imgResults, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in get userid roles get user image.'
                    });
                } else {
                    if (req.files) {
                        if(!filename || !config.patterns.names.test(filename)) {
                            return res.send({
                                success: false,
                                message: 'Filename empty or Letters Numbers Spaces _ - and . allowed.'
                            });
                        }
                        if(!validateImageUpload(req.files)) {
                            return res.send({
                                success: false,
                                message: 'File is invalid.'
                            });
                        }
                        if(config.patterns.names.test(imgResults[0][config.tables[2].table_fields[7].Field])) {
                            if(urlExists(imagePath + `/img/avatar/${uniqueId(parseInt(id))}/${imgResults[0][config.tables[2].table_fields[7].Field]}`)) {
                                fs.unlink(imagePath + `/img/avatar/${uniqueId(parseInt(id))}/${imgResults[0][config.tables[2].table_fields[7].Field]}`, (err) => {
                                    if (err) {
                                        return res.send({
                                            success: false,
                                            message: 'Server Error in delete user image update user.'
                                        });
                                    } else {
                                        let ext = '';
                                        var splitRes = req.files.file.mimetype.split("/");
                                        switch(splitRes[1]) {
                                            case 'jpeg': ext = '.jpg'; break;
                                            case 'jpg': ext = '.jpg'; break;
                                            case 'png': ext = '.png'; break;
                                            case 'gif': ext = '.gif'; break;
                                        }
                                        
                                        let image = req.body.filename + ext;
                                        if(config.patterns.names.test(image)) updateObj.push({
                                            name: config.tables[2].table_fields[7].Field,
                                            content: image
                                        });

                                        let imageFile = req.files['file'];
                                        imageFile.mv(imagePath + `/img/avatar/${uniqueId(parseInt(id))}/${req.body.filename}${ext}`,
                                            function(err) {
                                                if (err) {
                                                    return res.send({
                                                        success: false,
                                                        message: 'Server error uploading image.'
                                                    });
                                                } else {
                                                    let updateUser = "UPDATE ?? SET ";
                                                    let updateUserInserts = [
                                                        config.tables[2].table_name
                                                    ];
                                                    let objCount=0;
                                                    updateObj.forEach(element => {
                                                        if(updateObj.length - 1 == objCount) updateUser += "?? = ? ";
                                                        else updateUser += "?? = ?, ";
                                                        updateUserInserts.push(element.name);
                                                        updateUserInserts.push(element.content);
                                                        objCount++;
                                                    });
                                                    updateUser += `WHERE ?? = ?`;
                                                    updateUserInserts.push(config.tables[2].table_fields[0].Field);
                                                    updateUserInserts.push(parseInt(id));
                                                    
                                                    updateUser = mysql.format(updateUser, updateUserInserts);
                                                    connection.query(updateUser, function (error, result, fields) {
                                                        if(error) {
                                                            return res.send({
                                                                success: false,
                                                                message: 'Server Error in user update'
                                                            });
                                                        } else {
                                                            return res.send({
                                                                success: true,
                                                                message: 'User successfully updated.',
                                                                id: id,
                                                                role: role,
                                                                name: name,
                                                                email: email,
                                                                ifactive: ifactive,
                                                                address: address,
                                                                city: city,
                                                                state: state,
                                                                zip: zip,
                                                                image: image
                                                            });
                                                        }
                                                    });    
                                                }
                                        });
                                    }
                                });
                            } else {
                                return res.send({
                                    success: false,
                                    message: 'The Image does not exsist. Please delete the product and try again.'
                                });
                            }
                        }
                    } else {
                        let image = imgResults[0]['avatar'];
                        let updateUser = "UPDATE ?? SET ";
                        let updateUserInserts = [
                            config.tables[2].table_name
                        ];
                        let objCount=0;
                        updateObj.forEach(element => {
                            if(updateObj.length - 1 == objCount) updateUser += "?? = ? ";
                            else updateUser += "?? = ?, ";
                            updateUserInserts.push(element.name);
                            updateUserInserts.push(element.content);
                            objCount++;
                        });
                        updateUser += `WHERE ?? = ?`;
                        updateUserInserts.push(config.tables[2].table_fields[0].Field);
                        updateUserInserts.push(parseInt(id));
                        
                        updateUser = mysql.format(updateUser, updateUserInserts);
                        connection.query(updateUser, function (error, result, fields) {
                            if(error) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in user update'
                                });
                            } else {
                                return res.send({
                                    success: true,
                                    message: 'User successfully updated.',
                                    id: id,
                                    role: role,
                                    name: name,
                                    image: image,
                                    email: email,
                                    ifactive: ifactive,
                                    address: address,
                                    city: city,
                                    state: state,
                                    zip: zip,
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

/*
 ************************ Merchant Orders  *****************************
 ***********************************************************************
 */

app.post('/api/orders/referrals', function(req, res) {
    const { body } = req;
    const {
        currentPage,
        perPage
    } = body;

    if(!currentPage || !config.patterns.numbers.test(currentPage)) {
        return res.send({
            success: false,
            message: 'Current page invalid or cannot be left empty.'
        });
    }

    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }

    let orderList = "SELECT * FROM ??";
    let orderListInserts = [
        config.tables[5].table_name
    ];
    orderList = mysql.format(orderList, orderListInserts);
    connection.query(orderList, function (error, result, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in update profile'
            });
        } else {
            return res.send({
                success: true,
                message: 'Success',
                orders: result
            });
        }
    });
});

app.post('/api/morders/all', function(req, res) {
    const { body } = req;
    const {
        currentPage,
        perPage,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!currentPage || !config.patterns.numbers.test(currentPage)) {
        return res.send({
            success: false,
            message: 'Current page invalid or cannot be left empty.'
        });
    }

    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid user list orders.'
            });
        } else {
            let start = (currentPage-1)*perPage;
            let orderList = "SELECT * FROM ?? ORDER BY ?? DESC LIMIT ?, ?";
            let orderListInserts = [
                config.tables[5].table_name,
                config.tables[5].table_fields[0].Field,
                start, perPage
            ];
            orderList = mysql.format(orderList, orderListInserts);
            connection.query(orderList, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in update profile'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        orders: result
                    });
                }
            });
        }
    });
});

app.post('/api/morders/items', function(req, res) {
    const { body } = req;
    const {
        items,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!items || !config.patterns.names.test(items)) {
        return res.send({
            success: false,
            message: 'Items invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid display order.'
            });
        } else {
            let productids = items.split("_");
            let productString = productids.join(",");
            let productList = "SELECT * FROM ?? WHERE ?? IN (" + productString + ");";
            let productListInserts = [
                config.tables[0].table_name,
                config.tables[0].table_fields[0].Field,
            ];
            productList = mysql.format(productList, productListInserts);
            connection.query(productList, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in get product list display order.'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        products: result
                    });
                }
            });
        }
    });
});

app.post('/api/morders/upload', (req, res, next) => {
    const { body } = req;
    const {
        id,
        name,
        address,
        city,
        state,
        zip,
        proids,
        numofs,
        prices,
        orderitems,
        token
    } = body;
    let { email } = body;

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Userid invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!orderitems || !config.patterns.names.test(orderitems)) {
        return res.send({
        success: false,
        message: 'Error: Order items cannot be blank'
        });
    }

    if(!proids || !config.patterns.names.test(proids)) {
        return res.send({
        success: false,
        message: 'Error: Proids cannot be blank'
        });
    }

    if(!numofs || !config.patterns.names.test(numofs)) {
        return res.send({
        success: false,
        message: 'Error: Numofs cannot be blank'
        });
    }

    if(!prices || !config.patterns.names.test(prices)) {
        return res.send({
        success: false,
        message: 'Error: Prices cannot be blank'
        });
    }

    if(!name || !config.patterns.names.test(name)) {
        return res.send({
        success: false,
        message: 'Error: Name cannot be blank'
        });
    }

    if(!email || !config.patterns.emails.test(email)) {
        return res.send({
        success: false,
        message: 'Error: Email name cannot be blank'
        });
    }

    if(!address || !config.patterns.names.test(address)) {
        return res.send({
        success: false,
        message: 'Error: Address name cannot be blank'
        });
    }

    if(!city || !config.patterns.names.test(city)) {
        return res.send({
        success: false,
        message: 'Error: City name cannot be blank'
        });
    }

    if(!state || !config.patterns.names.test(state)) {
        return res.send({
        success: false,
        message: 'Error: State name cannot be blank'
        });
    }
    
    if(!zip || !config.patterns.numbers.test(zip)) {
        return res.send({
        success: false,
        message: 'Error: State name cannot be blank'
        });
    }

    email = email.toLowerCase();

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid create order.'
            });
        } else {
            var insertMerchantOrder = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', 0, '', ?)";
            var inserts = [
                config.tables[5].table_name,
                id, myDate, myDate, name, email,
                address, city, state, zip,
                proids, numofs, prices, orderitems
            ];
            insertMerchantOrder = mysql.format(insertMerchantOrder, inserts);
            connection.query(insertMerchantOrder, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in create order',
                        token: null,
                        id: null
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Successfull order',
                        transid: result.insertId,
                        id: id,
                        name: name,
                        email: email,
                        address: address,
                        city: city,
                        state: state,
                        zip: zip,
                        proids: proids,
                        numofs: numofs,
                        prices: prices,
                        orderitems: orderitems
                    });
                }
            });
        }
    });
});

/*
 ************************ Customer Orders  *****************************
 ***********************************************************************
 */

app.post('/api/corders/all', function(req, res) {
    const { body } = req;
    const {
        currentPage,
        perPage,
        token
    } = body;

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!currentPage || !config.patterns.numbers.test(currentPage)) {
        return res.send({
            success: false,
            message: 'Current page invalid or cannot be left empty.'
        });
    }

    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid corders list.'
            });
        } else {
            let start = (currentPage-1)*perPage;
            let orderList = "SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? DESC LIMIT ?, ?";
            let orderListInserts = [
                config.tables[5].table_name,
                config.tables[5].table_fields[1].Field,
                results[0][config.tables[3].table_fields[1].Field],
                config.tables[5].table_fields[0].Field,
                start, perPage
            ];
            orderList = mysql.format(orderList, orderListInserts);
            connection.query(orderList, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in get corders list'
                    });
                } else {
                    if(result) {
                        return res.send({
                            success: true,
                            message: 'Success',
                            orders: result
                        });
                    } else {
                        return res.send({
                            success: true,
                            message: 'No orders yet.'
                        });
                    }
                }
            });
        }
    });
});

app.post('/api/corders/survey', function(req, res) {
    const { body } = req;
    const {
        id,
        iffront,
        stars,
        comment,
        token
    } = body;

    if(!id || !config.patterns.numbers.test(id)) {
        return res.send({
            success: false,
            message: 'Id invalid or cannot be left empty.'
        });
    }

    if(!token || !config.patterns.numbers.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    if(!iffront || !config.patterns.numbers.test(iffront)) {
        return res.send({
            success: false,
            message: 'If front invalid or cannot be left empty.'
        });
    }

    if(!stars || !config.patterns.numbers.test(stars)) {
        return res.send({
            success: false,
            message: 'Stars invalid or cannot be left empty.'
        });
    }

    if(!comment || !config.patterns.names.test(comment)) {
        return res.send({
            success: false,
            message: 'Comment invalid or cannot be left empty.'
        });
    }

    let survey = iffront + "_" + stars + "_" + comment;

    let getUserIdSession = "SELECT ?? FROM ?? WHERE ?? = ?";
    let userIdInserts = [
        config.tables[3].table_fields[1].Field,
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token
    ];
    getUserIdSession = mysql.format(getUserIdSession, userIdInserts);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in get userid update survey.'
            });
        } else {
            let updateSurvey = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            let updateSurveyInserts = [
                config.tables[5].table_name,
                config.tables[5].table_fields[15].Field,
                survey,
                config.tables[5].table_fields[0].Field,
                id
            ];

            updateSurvey = mysql.format(updateSurvey, updateSurveyInserts);
            connection.query(updateSurvey, function (error, result, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server error in update survey'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Your survey has been successfully updated.',
                        iffront: iffront,
                        stars: stars,
                        comment: comment
                    });
                }
            });
        }
    });
});

http.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
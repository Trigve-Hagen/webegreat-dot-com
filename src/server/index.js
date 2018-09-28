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
const urlConfig = require('../config/config');
const app = express();
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/
let reqPath = path.join(__dirname, '../'); let imagePath = '';
if(!reqPath.split(path.sep).indexOf("html")) {
    imagePath = reqPath + '/assets';
} else {
    imagePath = reqPath + '/dist';
    app.use(express.static(path.join(reqPath, 'dist')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(reqPath, 'dist', 'index.html'));
    });
}

const config = require('./config/mysqldbconfig');

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
    config.connection.name, config, connection
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

function testErrorsOnServer(content) {
    fs.writeFile("/tmp/webegreat", content, function(err) {
        if(err) console.log(err);
        else console.log("The file was saved!");
    });
};

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
            testErrorsOnServer(testForExistingUser + ", " + error);
            return res.send({
                success: false,
                message: 'Server Error in check user exsists signup.',
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
                var insertUserIfNonExists = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, 1, '', 0, '', '', '', '')";
                var inserts = [
                    config.tables[2].table_name,
                    myDate, myDate, name, email, generateHash(password)
                ];
                insertUserIfNonExists = mysql.format(insertUserIfNonExists, inserts);
                //console.log(insertUserIfNonExists);
                connection.query(insertUserIfNonExists, function (err, result, fields) {
                    if(err) {
                        //console.log("Error: in Register New User: " + err);
                        return res.send({
                            success: false,
                            message: 'Server error in register users insert',
                            token: null,
                            id: null
                        });
                    } else {
                        let insertPaypal = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, '', '', '')";
                        let inserts = [
                            config.tables[4].table_name,
                            result.insertId, myDate, myDate,
                        ];
                        insertPaypal = mysql.format(insertPaypal, inserts);
                        //console.log(insertUserIfNonExists);
                        connection.query(insertPaypal, function (error, results, fields) {
                            if(error) {
                                //console.log("Error: in Register Session: " + error);
                                return res.send({
                                    success: false,
                                    message: 'Server error in register paypal insert',
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
                                            message: 'Server error in register session insert',
                                            token: null,
                                            id: null
                                        });
                                    } else {
                                        //console.log("Results: in SignIn: " + results);
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
            testErrorsOnServer(testForExistingUser + ", "  + error);
            return res.send({
                success: false,
                message: 'Server Error in check user exsists signin.',
                token: null,
                id: null
            });
        } else {
            if(results.length == 1) {
                if(results[0].email == email && validatePassword(password, results[0].password)) {
                    //currentTimestamp = moment().unix();//in seconds
                    //let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");

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
                                token: result.insertId
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

app.post('/api/account/logout', (req, res, next) => {
    const { body } = req;
    const { token } = body;
    //console.log(token+", here");
    //console.log(util.inspect(token, {showHidden: false, depth: null}))
    let setLoggedOutSession = "UPDATE ?? SET ?? = 1 WHERE ?? = ?";
    let inserts = [config.tables[3].table_name, config.tables[3].table_fields[4].Field, config.tables[3].table_fields[0].Field, token];
    setLoggedOutSession = mysql.format(setLoggedOutSession, inserts);
    //console.log(setLoggedOutSession);
    connection.query(setLoggedOutSession, function (error, result, fields) {
        if(error) {
            //console.log("Error: in Register Session: " + error);
            return res.send({
                success: false,
                message: 'Server Error in log out Session'
            });
        } else {
            //console.log("Results: in SignIn: " + result);
            return res.send({
                success: true,
                message: 'Successfull Logout'
            });
        }
    });
});

app.get('/api/account/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    let testForExistingSession = "SELECT * FROM ?? WHERE ?? = ? AND ?? = 0";
    let inserts = [
        config.tables[3].table_name,
        config.tables[3].table_fields[0].Field,
        token, config.tables[3].table_fields[3].Field
    ];
    testForExistingSession = mysql.format(testForExistingSession, inserts);
    //console.log(testForExistingUser);
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
                //console.log("Results: in SignIn: Please Register");
                return res.send({
                    success: true,
                    message: 'Session Valid.'
                });
            }
        }
    });
});

/*
 ********************** Product Upload && Update ***********************
 ***********************************************************************
 */


app.post('/api/product/pagination', function(req, res) {
    const { body } = req;
    const {
        perPage
    } = body;

    if(!perPage || !config.patterns.numbers.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }

    let countFrontProducts = "SELECT COUNT(??) FROM ??";
    let countFrontProductsInserts = [
        config.tables[0].table_fields[0].Field,
        config.tables[0].table_name
    ];
    countFrontProducts = mysql.format(countFrontProducts, countFrontProductsInserts);
    //console.log(getUserIdSession);
    connection.query(countFrontProducts, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in count products for pagination.'
            });
        } else {
            let pages = Math.ceil(results[0]['COUNT(`productid`)'] / perPage);
            return res.send({
                success: true,
                message: 'Success',
                pages: pages
            });
        }
    });
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
    //console.log(getUserIdSession);
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
                results[0]['user_id'],
            ];
            getProductToDeleteById = mysql.format(getProductToDeleteById, getProductToDeleteByIdInserts);
            console.log(getProductToDeleteById);
            connection.query(getProductToDeleteById, function (error, results, fields) {
                if(error) {
                    return res.send({
                        success: false,
                        message: 'Server Error in get product by id to delete.'
                    });
                } else {
                    if(urlExists(imagePath + `/img/products/${results[0]['image']}`)) {
                        fs.unlink(imagePath + `/img/products/${results[0]['image']}`, (err) => {
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
                                    results[0]['user_id'],
                                ];
                                deleteProduct = mysql.format(deleteProduct, deleteProductInserts);
                                console.log(deleteProduct);
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
                            results[0]['user_id'],
                        ];
                        deleteProduct = mysql.format(deleteProduct, deleteProductInserts);
                        console.log(deleteProduct);
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
        currentPage
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

    let countFrontProducts = "SELECT COUNT(??) FROM ??";
    let countFrontProductsInserts = [
        config.tables[0].table_fields[0].Field,
        config.tables[0].table_name
    ];
    countFrontProducts = mysql.format(countFrontProducts, countFrontProductsInserts);
    //console.log(getUserIdSession);
    connection.query(countFrontProducts, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in count products.'
            });
        } else {
            let start = (currentPage-1)*perPage;
            //console.log(util.inspect(results[0]['COUNT(`productid`)'], {showHidden: false, depth: null}))
            //console.log(start + ", Pages");

            let getFrontProducts = "SELECT * FROM ?? ORDER BY ?? DESC LIMIT ?, ?";
            let getFrontProductInserts = [
                config.tables[0].table_name,
                config.tables[0].table_fields[7].Field,
                start, perPage
            ];
            getFrontProducts = mysql.format(getFrontProducts, getFrontProductInserts);
            //console.log(getFrontProducts);
            connection.query(getFrontProducts, function (err, result, fields) {
                if(err) {
                    console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server Error in product upload'
                    });
                } else {
                    //jsonObj = {};
                    //jsonObj['results'] = result;
                    //console.log(util.inspect(jsonObj['results'], {showHidden: false, depth: null}));
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
        name,
        description,
        price,
        token
    } = body;
    
    if (!req.files) {
        return res.send({
            success: false,
            message: 'No file was uploaded.'
        });
    }

    if(!filename || !config.patterns.names.test(filename)) {
        return res.send({
            success: false,
            message: 'Image name invalid or cannot be left empty.'
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

    if(!price || !config.patterns.names.test(price)) {
        return res.send({
            success: false,
            message: 'Price invalid or cannot be left empty.'
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
                message: 'Server Error in get userid.'
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
            let imageFile = req.files['file'];
            let image = req.body.filename + ext;

            imageFile.mv(imagePath + `/img/products/${req.body.filename}${ext}`,
                function(err) {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Server error uploading image.'
                        });
                    } else {
                        console.log( + ", UserId");
                        //currentTimestamp = moment().unix();//in seconds
                        //let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");

                        var insertProduct = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?)";
                        var insertProductInserts = [
                            config.tables[0].table_name,
                            myDate, myDate, results[0]['user_id'], name,
                            description, image, price
                        ];
                        insertProduct = mysql.format(insertProduct, insertProductInserts);
                        //console.log(insertProduct);
                        connection.query(insertProduct, function (error, result, fields) {
                            if(error) {
                                //console.log("Error: in Register New User: " + err);
                                return res.send({
                                    success: false,
                                    message: 'Server Error in product upload'
                                });
                            } else {
                                return res.send({
                                    success: true,
                                    message: 'Your Product has been successfully uploaded.',
                                    id: result.insertId,
                                    name: name,
                                    description: description,
                                    price: price,
                                    image: image
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
        name,
        description,
        price,
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

    //console.log(token + ", " + proid);

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
        //console.log(getUserIdSession);
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
                                
                                let image = req.body.filename + ext;
                                if(config.patterns.names.test(image)) updateObj.push({
                                    name: config.tables[0].table_fields[6].Field,
                                    content: image
                                });

                                let imageFile = req.files['file'];
                                imageFile.mv(imagePath + `/img/products/${req.body.filename}${ext}`,
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
                                            updateProduct += `WHERE ?? = ${proid} AND ?? = ${results[0]['user_id']}`;
                                            updateProductInserts.push(config.tables[0].table_fields[0].Field);
                                            updateProductInserts.push(config.tables[0].table_fields[3].Field);
                                            
                                            updateProduct = mysql.format(updateProduct, updateProductInserts);
                                            //console.log(updateProduct);
                                            connection.query(updateProduct, function (error, result, fields) {
                                                if(error) {
                                                    //console.log("Error: in Register New User: " + err);
                                                    return res.send({
                                                        success: false,
                                                        message: 'Server Error in product update'
                                                    });
                                                } else {
                                                    // do results here
                                                    return res.send({
                                                        success: true,
                                                        message: 'Your Product has been successfully updated.',
                                                        id: result.insertId,
                                                        name: name,
                                                        description: description,
                                                        price: price,
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
        //console.log(getUserIdSession);
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
                updateProduct += `WHERE ?? = ${proid} AND ?? = ${results[0]['user_id']}`;
                updateProductInserts.push(config.tables[0].table_fields[0].Field);
                updateProductInserts.push(config.tables[0].table_fields[3].Field);
                
                updateProduct = mysql.format(updateProduct, updateProductInserts);
                //console.log(updateProduct);
                connection.query(updateProduct, function (error, result, fields) {
                    if(error) {
                        //console.log("Error: in Register New User: " + err);
                        return res.send({
                            success: false,
                            message: 'Server Error in product update no image'
                        });
                    } else {
                        //console.log(util.inspect(result, {showHidden: false, depth: null}));
                        //console.log("Here Result: " + result);
                        return res.send({
                            success: true,
                            message: 'Your Product has been successfully updated.',
                            id: proid,
                            name: name,
                            description: description,
                            price: price,
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
    //console.log(getUserIdSession);
    connection.query(getUserIdSession, function (error, results, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server Error in get userid update avatar.'
            });
        } else {
            console.log(imagePath + `/img/avatar/${imagename}`);
            if(urlExists(imagePath + `/img/avatar/${imagename}`)) {
                fs.unlink(imagePath + `/img/avatar/${imagename}`, (err) => {
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
                        imageFile.mv(imagePath + `/img/avatar/${req.body.filename}${ext}`,
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
                                        results[0]['user_id']
                                    ];
                                    updateAvatar = mysql.format(updateAvatar, updateAvatarInserts);
                                    //console.log(updateProduct);
                                    connection.query(updateAvatar, function (error, result, fields) {
                                        if(error) {
                                            //console.log("Error: in Register New User: " + err);
                                            return res.send({
                                                success: false,
                                                message: 'Server Error in avatar update'
                                            });
                                        } else {
                                            // do results here
                                            return res.send({
                                                success: true,
                                                message: 'Your Avatar has been successfully updated.',
                                                avatar: image
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

    console.log(name + ", " + email);

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
    //console.log(getUserIdSession);
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
            updateProfile += `WHERE ?? = ${results[0]['user_id']}`;
            updateProfileInserts.push(config.tables[2].table_fields[0].Field);

            updateProfile = mysql.format(updateProfile, updateProfileInserts);
            //console.log(updateProfile);
            connection.query(updateProfile, function (error, result, fields) {
                if(error) {
                    //console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server error in update profile'
                    });
                } else {
                    // do results here
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
    //console.log(getUserIdSession);
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
                results[0]['user_id']
            ];

            updatePaypal = mysql.format(updatePaypal, updatePaypalInserts);
            //console.log(updatePaypal);
            connection.query(updatePaypal, function (error, result, fields) {
                if(error) {
                    //console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server error in update profile'
                    });
                } else {
                    // do results here
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
    //console.log(getUserIdSession);
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
                    results[0]['user_id']
                ];

                updatePassword = mysql.format(updatePassword, updatePasswordInserts);
                //console.log(updatePassword);
                connection.query(updatePassword, function (error, result, fields) {
                    if(error) {
                        //console.log("Error: in Register New User: " + err);
                        return res.send({
                            success: false,
                            message: 'Server error in update profile'
                        });
                    } else {
                        // do results here
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
    //console.log(getUserIdSession);
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
                results[0]['user_id']
            ];

            updateVisibility = mysql.format(updateVisibility, updateVisibilityInserts);
            //console.log(updateVisibility);
            connection.query(updateVisibility, function (error, result, fields) {
                if(error) {
                    //console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server error in update visibility'
                    });
                } else {
                    // do results here
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
    //console.log(insertNewsletter);
    connection.query(insertNewsletter, function (error, result, fields) {
        if(error) {
            return res.send({
                success: false,
                message: 'Server error in register for newsletter'
            });
        } else {
            // do results here
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

    //console.log(util.inspect(items, {showHidden: false, depth: null}));
    //console.log("Products: " + products);

    var loadCredentials = "SELECT * FROM ?? LIMIT 1";
    var loadCredentialsInserts = [
        config.tables[4].table_name
    ];
    loadCredentials = mysql.format(loadCredentials, loadCredentialsInserts);
    //console.log(loadCredentials);
    connection.query(loadCredentials, function (error, results, fields) {
        if(error) {
            //console.log("Error: in Register New User: " + err);
            return res.send({
                success: false,
                message: 'Server Error in load credentials'
            });
        } else {
            //console.log(results[0]['client'] + ", " + results[0]['secret']);
            paypal.configure({
                "mode": results[0]['mode'],
                "client_id": results[0]['client'],
                "client_secret": results[0]['secret']
            });

            var loadProducts = "SELECT * FROM ??";
            var loadProductsInserts = [
                config.tables[0].table_name
            ];
            loadProducts = mysql.format(loadProducts, loadProductsInserts);
            //console.log(loadProducts);
            connection.query(loadProducts, function (error, results, fields) {
                if(error) {
                    //console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server Error in load products'
                    });
                } else {
                    //console.log(util.inspect(results, {showHidden: false, depth: null}));
                    let items = [];
                    itemIds.forEach(itemObj => {
                        results.forEach(product => {
                            //console.log(parseInt(id) + ", " + product['productid']);
                            if(parseInt(itemObj.id) == product['productid']) {
                                items.push({
                                    "name": product['name'],
                                    "sku": product['productid'].toString(),
                                    "price": product['price'],
                                    "currency": "USD",
                                    "quantity": parseInt(itemObj.quantity),
                                });
                            }
                        });
                    });
                    //console.log(util.inspect(items, {showHidden: false, depth: null}));
                    let cancelUrl = urlConfig.site_url + config.base.cancel;
                    let returnUrl = urlConfig.site_url + config.base.return;
                    let create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": returnUrl,
                            "cancel_url": cancelUrl
                        },
                        "transactions": [
                            {
                                "item_list": {
                                    "items": items
                                },
                                "amount": {
                                    "currency": "USD",
                                    "total": total
                                },
                                "description": "This is the payment description."
                            }
                        ]
                    };
                    //console.log(util.inspect(create_payment_json, {showHidden: false, depth: null}));
                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            return res.send({
                                success: false,
                                message: 'Error: You most likely forgot to upload your Paypal client id and secret or: ' + error
                            });
                        } else {
                            
                            var insertProduct = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?)";
                            var insertProductInserts = [
                                config.tables[5].table_name,
                                myDate, myDate, results[0]['user_id'], name,
                                description, image, price
                            ];
                            insertProduct = mysql.format(insertProduct, insertProductInserts);
                            //console.log(insertProduct);
                            connection.query(insertProduct, function (error, result, fields) {
                                if(error) {
                                    //console.log("Error: in Register New User: " + err);
                                    return res.send({
                                        success: false,
                                        message: 'Server Error in product upload'
                                    });
                                } else {
                                    console.log(payment.id);
                                    for(let i=0; i<payment.links.length; i++) {
                                        if(payment.links[i].rel === 'approval_url') {
                                            // insert order into database with a token or key from paypal to identify the transaction in /success.
                                            /*return res.send({
                                                success: true,
                                                url: payment.links[i].href
                                            });*/
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
});

app.get('/success', function(req, res) {
    const payerId = req.query.PayerId;
    const paymentId = req.query.paymentId;

    // query order in database with a token or key from paypal to identify the transaction in /success.
    // and get the total.

    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "1.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
        }
    });
});

app.get('/cancel', () => res.send('Cancelled'));

app.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
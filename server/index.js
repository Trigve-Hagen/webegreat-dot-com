const express = require('express');
const util = require('util');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config/mysqldbconfig');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const fileUpload = require('express-fileupload');
const app = express();

let reqPath = path.join(__dirname, '../');
const pattern = /^[A-Za-z0-9_\-\.\s]+$/i;
const emptyPattern = /^([A-Za-z0-9_\-\.\s]|^\s*$)+$/i;
const numberPattern = /^[0-9]+$/;
const passwordPattern = /^[A-Z0-9._%+-]+$/;
/* from https://www.regular-expressions.info/email.html */
const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/;

const clientRootFolder = 'src';

app.use(cors());
app.use(express.json());
app.use(fileUpload());

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

const mysqlhelpers = require('./config/mysqldbhelpers')(
    config.connection.name,
    config,
    connection
    );
mysqlhelpers.buildTables();

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

    if(!name || !pattern.test(name)) {
        return res.send({
            success: false,
            message: 'No name or Letters Numbers Spaces _ - and . allowed.'
        });
    }

    if(!email || !emailPattern.test(email)) {
        return res.send({
            success: false,
            message: 'No email or invalid email.'
        });
    }
    
    if(!password || !passwordPattern.test(password)) {
        return res.send({
            success: false,
            message: 'No password or invalid password.'
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

                let insertUserIfNonExists = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, 1, '')";
                let inserts = [
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
                            message: 'Server Error in Register',
                            token: null,
                            id: null
                        });
                    } else {
                        //console.log(result.insertId);
                        let insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                        let inserts = [config.tables[3].table_name, result.insertId, myDate, myDate];
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
                                    token: results.insertId
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

    if(!email || !emailPattern.test(email)) {
        return res.send({
            success: false,
            message: 'No email or invalid email.'
        });
    }
    
    if(!password || !passwordPattern.test(password)) {
        return res.send({
            success: false,
            message: 'No password or invalid password.'
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

                    let insertUserSession = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, 0)";
                    let inserts = [config.tables[3].table_name, results[0].userid, myDate, myDate];
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

/*
 ********************** Product Upload && Update ***********************
 ***********************************************************************
 */


app.post('/api/product/pagination', function(req, res) {
    const { body } = req;
    const {
        perPage
    } = body;

    if(!perPage || !numberPattern.test(perPage)) {
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

    if(!id || !numberPattern.test(id)) {
        return res.send({
            success: false,
            message: 'Id invalid or cannot be left empty.'
        });
    }

    if(!token || !numberPattern.test(token)) {
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
                    if(urlExists(`${reqPath}${clientRootFolder}/assets/img/products/${results[0]['image']}`)) {
                        fs.unlink(`${reqPath}${clientRootFolder}/assets/img/products/${results[0]['image']}`, (err) => {
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
    
    if(!perPage || !numberPattern.test(perPage)) {
        return res.send({
            success: false,
            message: 'Per page invalid or cannot be left empty.'
        });
    }
    if(!currentPage || !numberPattern.test(currentPage)) {
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

    if(!filename || !pattern.test(filename)) {
        return res.send({
            success: false,
            message: 'Image name invalid or cannot be left empty.'
        });
    }

    if(!name || !pattern.test(name)) {
        return res.send({
            success: false,
            message: 'Product name invalid or cannot be left empty.'
        });
    }

    if(!description || !pattern.test(description)) {
        return res.send({
            success: false,
            message: 'Description invalid or cannot be left empty.'
        });
    }

    if(!price || !pattern.test(price)) {
        return res.send({
            success: false,
            message: 'Price invalid or cannot be left empty.'
        });
    }

    if(!token || !pattern.test(token)) {
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
            let splitRes = req.files.file.mimetype.split("/");
            switch(splitRes[1]) {
                case 'jpeg': ext = '.jpg'; break;
                case 'jpg': ext = '.jpg'; break;
                case 'png': ext = '.png'; break;
                case 'gif': ext = '.gif'; break;
            }
            let imageFile = req.files['file'];
            let image = req.body.filename + ext;

            imageFile.mv(
                `${reqPath}${clientRootFolder}/assets/img/products/${req.body.filename}${ext}`,
                function(err) {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Server error uploading image.'
                        });
                    } else {
                        console.log( + ", UserId");
                        currentTimestamp = moment().unix();//in seconds
                        let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");

                        let insertProduct = "INSERT INTO ?? VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?)";
                        let insertProductInserts = [
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

    if(!proid || !numberPattern.test(proid)) {
        return res.send({
            success: false,
            message: 'Product id invalid or cannot be left empty.'
        });
    }

    if(!token || !numberPattern.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    //console.log(token + ", " + proid);

    if(pattern.test(name)) {
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

    if(pattern.test(price)) {
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
    
    if(pattern.test(description)) {
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
        if(!filename || !pattern.test(filename)) {
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
                if(pattern.test(imagename)) {
                    if(urlExists(`${reqPath}${clientRootFolder}/assets/img/products/${imagename}`)) {
                        fs.unlink(`${reqPath}${clientRootFolder}/assets/img/products/${imagename}`, (err) => {
                            if (err) {
                                return res.send({
                                    success: false,
                                    message: 'Server Error in delete product image update product.'
                                });
                            } else {
                                let ext = '';
                                let splitRes = req.files.file.mimetype.split("/");
                                switch(splitRes[1]) {
                                    case 'jpeg': ext = '.jpg'; break;
                                    case 'jpg': ext = '.jpg'; break;
                                    case 'png': ext = '.png'; break;
                                    case 'gif': ext = '.gif'; break;
                                }
                                
                                let image = req.body.filename + ext;
                                if(pattern.test(image)) updateObj.push({
                                    name: config.tables[0].table_fields[6].Field,
                                    content: image
                                });

                                let imageFile = req.files['file'];
                                imageFile.mv(
                                    `${reqPath}${clientRootFolder}/assets/img/products/${req.body.filename}${ext}`,
                                    function(err) {
                                        if (err) {
                                            return res.send({
                                                success: false,
                                                message: 'Server error uploading image.'
                                            });
                                        } else {
                                            let updateProduct = "UPDATE ?? SET ";
                                            let updateProductInserts = [
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
                let updateProduct = "UPDATE ?? SET ";
                let updateProductInserts = [
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

app.post('/api/avatar/load-avatar', function(req, res) {
    const { body } = req;
    const {
        token
    } = body;

    if(!token || !numberPattern.test(token)) {
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
                message: 'Server Error in get userid load avatar.'
            });
        } else {
            let loadAvatar = "SELECT ?? FROM ?? WHERE ?? = ?";
            let loadAvatarInserts = [
                config.tables[2].table_fields[7].Field,
                config.tables[2].table_name,
                config.tables[2].table_fields[0].Field,
                results[0]['user_id']
            ];
            loadAvatar = mysql.format(loadAvatar, loadAvatarInserts);
            //console.log(loadAvatar);
            connection.query(loadAvatar, function (error, results, fields) {
                if(error) {
                    //console.log("Error: in Register New User: " + err);
                    return res.send({
                        success: false,
                        message: 'Server Error in load avatar'
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Success',
                        avatar: results[0]['avatar']
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

    if(!token || !numberPattern.test(token)) {
        return res.send({
            success: false,
            message: 'Invalid token.'
        });
    }

    if(!filename || !pattern.test(filename)) {
        return res.send({
            success: false,
            message: 'No filename or Letters Numbers Spaces _ - and . allowed.'
        });
    }

    if(!imagename || !pattern.test(imagename)) {
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
            if(urlExists(`${reqPath}${clientRootFolder}/assets/img/avatar/${imagename}`)) {
                fs.unlink(`${reqPath}${clientRootFolder}/assets/img/avatar/${imagename}`, (err) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Server Error in delete product image update product.'
                        });
                    } else {
                        let ext = '';
                        let splitRes = req.files.file.mimetype.split("/");
                        switch(splitRes[1]) {
                            case 'jpeg': ext = '.jpg'; break;
                            case 'jpg': ext = '.jpg'; break;
                            case 'png': ext = '.png'; break;
                            case 'gif': ext = '.gif'; break;
                        }
                        
                        let image = req.body.filename + ext;
                        let imageFile = req.files['file'];
                        imageFile.mv(
                            `${reqPath}${clientRootFolder}/assets/img/avatar/${req.body.filename}${ext}`,
                            function(err) {
                                if (err) {
                                    return res.send({
                                        success: false,
                                        message: 'Server error updating avatar.'
                                    });
                                } else {
                                    let updateAvatar = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                                    let updateAvatarInserts = [
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
        token
    } = body;
    let { email } = body;

    let updateObj = [];

    if(!token || !numberPattern.test(token)) {
        return res.send({
            success: false,
            message: 'Token invalid or cannot be left empty.'
        });
    }

    //console.log(token + ", " + proid);

    if(pattern.test(name)) {
        updateObj.push({
            name: config.tables[2].table_fields[2].Field,
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

    if(pattern.test(email)) {
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
                message: 'Server Error in get userid update profile.'
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
                        message: 'Server Error in avatar update'
                    });
                } else {
                    // do results here
                    return res.send({
                        success: true,
                        message: 'Your Avatar has been successfully updated.',
                        name: name,
                        email: email
                    });
                }
            });
        }
    });
});

app.listen(4000, () => {
    console.log('  :)=>  Products server listening on port 4000');
});
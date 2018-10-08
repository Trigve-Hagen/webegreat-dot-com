module.exports = function(database, config, connection, moment, fs, reqPath) {
    var module = {};
    let tablesAndRowsDb = [];
    let tablesAndRowsConfig = config.tables;

    function compare(a, b) {
        const genreA = a.table_name.toUpperCase();
        const genreB = b.table_name.toUpperCase();
      
        let comparison = 0;
        if (genreA > genreB) {
          comparison = 1;
        } else if (genreA < genreB) {
          comparison = -1;
        }
        return comparison;
    }

    function addAndRemoveRows(tablesAndRowsDb, tablesAndRowsConfig) {

    }

    function addAndRemoveTables(tablesAndRowsDb, tablesAndRowsConfig) {
        let actionObject = []; // let tableCount = 0; let ifAllSame = true;
        if(tablesAndRowsConfig.length != tablesAndRowsDb.length) {

            console.log(tablesAndRowsConfig.length + ", " + tablesAndRowsDb.length);
            if(tablesAndRowsConfig.length > tablesAndRowsDb.length) {
                tablesAndRowsConfig.forEach(config_element => {
                    let inArray = false;
                    tablesAndRowsDb.forEach(database_element => {
                        if(config_element.table_name == database_element.table_name) {
                            inArray = true;
                        }
                    });
                    if(inArray == false) resolveDifferences({ action: 'addTables', table_name: config_element.table_name });
                });
            } else {
                tablesAndRowsDb.forEach(database_element => {
                    let inArray = false;
                    tablesAndRowsConfig.forEach(config_element => {
                        if(database_element.table_name == config_element.table_name) {
                            inArray = true;
                        }
                    });
                    if(inArray == false) resolveDifferences({ action: 'removeTables', table_name: database_element.table_name });
                });
            }
        } /*else { // could check for same fields just a name change, unless you just changes names && add or remove fields it will drop and rebuilt table
            tablesAndRowsConfig.forEach(element => {
                if(element.table_name != tablesAndRowsConfig[tableCount].table_name) ifAllSame = false;
                tableCount++;
            });
        }

        if(!ifAllSame) {
            console.log("Not the same names.")
        }*/
        if(actionObject.length == 0) actionObject.push({ action: 'noAction' });
        return actionObject;
    }

    function resolveDifferences(diff) {
        switch(diff.action) {
            case 'addTables': console.log("Add Tables" + diff.table_name); addTables(diff.table_name); break;
            case 'addRows':  console.log("Add Rows."); break;
            case 'updateFields':  console.log("Update Fields."); break;
            case 'removeTables': console.log("Remove Tables:" + diff.table_name); removeTables(diff.table_name); break;
            case 'removeRows': console.log("Remove Rows."); break;
            default:
                return null;
        }
    }

    function addTables(table_name) {
        tablesAndRowsConfig.forEach(element => {
            if(element.table_name == table_name) {
                let queryString = `CREATE TABLE IF NOT EXISTS ${table_name}(`; let count = 0; let ifPri = false; let priField = '';
                element.table_fields.forEach(field => {
                    if(field.Key == 'PRI') {
                        queryString += `${field.Field} ${field.Type} ${field.Null} ${field.Extra}, `; ifPri = true; priField = field.Field;
                    } else {
                        queryString += `${field.Field} ${field.Type} ${field.Null} ${field.Default} ${field.Extra}, `;
                    }
                    if(count == element.table_fields.length - 1) {
                        if(ifPri) queryString += `PRIMARY KEY (${priField}));`;
                        else queryString += `);`;
                    }
                    count++;
                });
                console.log(queryString);
                connection.query(queryString, (error, results) => {
                    if(error) {
                        console.log(error);
                        //return res.send(error);
                    } else {
                        console.log(results);
                    }
                });
            }
        });
    }

    function removeTables(table_name) {
        let queryString = `DROP TABLE IF EXISTS ${table_name};`;
        connection.query(queryString, (error, results) => {
            if(error) {
                console.log(error);
                //return res.send(error);
            } else {
                console.log(results);
            }
        });
    }

    function createUserAvatar() {
        let unique = 321 - 50 * 2;
        signUpDir = reqPath + '/assets/img/avatar/' + unique;
        if (fs.existsSync(signUpDir)) {
            console.log('User avatar folder exist on server.');
        } else {
            fs.mkdir(signUpDir, function(err, data) {
                if(err) {
                    console.log('Could not make folder.');
                } else {
                    fs.readFile(reqPath + '/assets/img/user-avatar.jpg', function (err, imageData) {
                        if (err) {
                            console.log('Could not read image.');
                        } else {
                            fs.writeFile(reqPath + '/assets/img/avatar/' + unique + '/user-avatar.jpg', imageData, function (err) {
                                if (err) {
                                    console.log('Could not write image.');
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    // what if they want to update the names for tighter security
    function addInitialRows(configObject) {
        let currentTimestamp = moment().unix();
        let myDate = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss");
        configObject.forEach(element => {
            if(element.table_name == 'b_userroles') {
                // basic, unlimited, admin
                const userRoles = [
                    `INSERT INTO ${element.table_name} VALUES(1, 'basic', 1);`,
                    `INSERT INTO ${element.table_name} VALUES(2, 'unlimited', 2);`,
                    `INSERT INTO ${element.table_name} VALUES(3, 'admin', 3);`
                ];
                userRoles.forEach(insert => {
                    connection.query(insert, (error, results) => {
                        if(error) console.log(error);
                    });
                });
            }
            if(element.table_name == 'c_users') {
                const ADMIN_USER = `INSERT INTO ${element.table_name} VALUES(321, '${myDate}', '${myDate}', 'Trigve Hagen', 'trigve.hagen@gmail.com', '$2a$08$gfXxjtPIkYSSP9tNQMF0qeeUB7cJ.RPHVo3Kg.3.zj4IoSTB/irw6', 3, 'user-avatar.jpg', 1, '', '', '', '');`;
                connection.query(ADMIN_USER, (error, results) => {
                    if(error) console.log(error);
                });
            }
            if(element.table_name == 'e_paypal') {
                const PAYPAL_USER = `INSERT INTO ${element.table_name} VALUES(301, 321, '${myDate}', '${myDate}', '', '', '');`;
                connection.query(PAYPAL_USER, (error, results) => {
                    if(error) console.log(error);
                });
            }
            if(element.table_name == 'a_products') {
                const products = [
                    `INSERT INTO ${element.table_name} VALUES(1, '${myDate}', '${myDate}', 321, 'Army Airborne T-Shirt', 'Grey t-shirt with Airborne image on front and American flag on sleeve.', 'airborne-shirt.png', '39.99', 'Tshirts', 100, 0, 'WBG-TS1', 'Army Airborne T-Shirt WBG-TS1 Grey t-shirt with Airborne image on front and American flag on sleeve. 39.99');`,
                    `INSERT INTO ${element.table_name} VALUES(2, '${myDate}', '${myDate}', 321, 'Dont Tread on Me', 'American flag colored bearded skull on front of a black t-shirt with american flag on one sleeve and cross guns on the other.', 'black-shirt.png', '39.99', 'Tshirts', 100, 0, 'WBG-TS2', 'Dont Tread on Me WBG-TS2 American flag colored bearded skull on front of a black t-shirt with american flag on one sleeve and cross guns on the other. 39.99');`,
                    `INSERT INTO ${element.table_name} VALUES(3, '${myDate}', '${myDate}', 321, 'Army Cologne', 'Smell and feel like a true warrior with the best cologne in the west.', 'cologne.png', '69.99', 'Cologne', 100, 0, 'WBG-C1', 'Army Cologne WBG-C1 Smell and feel like a true warrior with the best cologne in the west. 69.99');`,
                    `INSERT INTO ${element.table_name} VALUES(4, '${myDate}', '${myDate}', 321, 'Army Baseball Caps', 'Assortment of Army baseball caps for $12.99 each tax included.', 'hats.png', '12.99', 'Hats', 100, 0, 'WBG-H1', 'Army Baseball Caps WBG-H1 Assortment of Army baseball caps for $12.99 each tax included. 12.99');`,
                    `INSERT INTO ${element.table_name} VALUES(5, '${myDate}', '${myDate}', 321, 'Swiss Army Watch and Knife Combo', 'Swiss Army quality service watch with knife combo for keeping time out in the field.', 'watch.png', '89.99', 'Watches', 100, 0, 'WBG-W1', 'Swiss Army Watch and Knife Combo WBG-W1 Swiss Army quality service watch with knife combo for keeping time out in the field. 89.99');`,
                ];
                products.forEach(insert => {
                    connection.query(insert, (error, results) => {
                        if(error) console.log(error);
                    });
                });
            }
            if(element.table_name == 'h_frontmenu') {
                const products = [
                    `INSERT INTO ${element.table_name} VALUES(1, 321, '${myDate}', '${myDate}', 'Army Clothing', 0, 'base', 'Army airborne clothing and clothing accessories department.', 0);`,
                    `INSERT INTO ${element.table_name} VALUES(2, 321, '${myDate}', '${myDate}', 'Army Hygiene', 0, 'base', 'Army airborne hygiene and hygiene accessories department.', 0);`,
                    `INSERT INTO ${element.table_name} VALUES(3, 321, '${myDate}', '${myDate}', 'Army Gear', 0, 'base', 'Army airborne gear department.', 0);`,
                    `INSERT INTO ${element.table_name} VALUES(4, 321, '${myDate}', '${myDate}', 'Cologne', 1, 'Army Hygiene', 'Army cologne department.', 1);`,
                    `INSERT INTO ${element.table_name} VALUES(5, 321, '${myDate}', '${myDate}', 'Shirts', 1, 'Army Clothing', 'Army airborne shirts department.', 0);`,
                    `INSERT INTO ${element.table_name} VALUES(6, 321, '${myDate}', '${myDate}', 'Tshirts', 2, 'Shirts', 'Army airborne t-shirts department.', 1);`,
                    `INSERT INTO ${element.table_name} VALUES(7, 321, '${myDate}', '${myDate}', 'Watches', 1, 'Army Gear', 'Army airborne watches and watch accessories department.', 1);`,
                ];
                products.forEach(insert => {
                    connection.query(insert, (error, results) => {
                        if(error) console.log(error);
                    });
                });
            }
        });
    }

    module.buildTables = function(req, res) {
        const GET_DATABASE_TABLES = `SELECT table_name FROM information_schema.tables where table_schema='${database}';`;
        connection.query(GET_DATABASE_TABLES, (err, results) => {
            if(err) {
                console.log(err);
                //return res.send(err);
            } else {
                if(results[0] == undefined) {
                    addAndRemoveTables(tablesAndRowsDb, tablesAndRowsConfig.sort(compare));
                    addInitialRows(tablesAndRowsConfig.sort(compare));
                    createUserAvatar();
                } else {
                    results.forEach(element => {
                        const GET_COLUMN_NAMES = `DESCRIBE ${element.table_name};`;
                        connection.query(GET_COLUMN_NAMES, (error, rowResults) => {
                            if(error) {
                                console.log(error);
                                //return res.send(error);
                            } else {
                                tablesAndRowsDb.push({
                                    table_name: element.table_name,
                                    table_fields: rowResults
                                });
                                if(tablesAndRowsDb.length == results.length) {
                                    //console.log(tablesAndRowsDb);
                                    //console.log(tablesAndRowsConfig);
                                    addAndRemoveTables(tablesAndRowsDb, tablesAndRowsConfig.sort(compare));
                                    addAndRemoveRows(tablesAndRowsDb, tablesAndRowsConfig.sort(compare));
                                }
                            }
                        });
                    });
                }
                //return res.json({
                    //data: results
                //});
            }
        });
    }

    return module;
};
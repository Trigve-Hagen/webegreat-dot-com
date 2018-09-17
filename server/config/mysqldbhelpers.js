module.exports = function(database, config, connection) {
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
                        queryString += `${field.Field} ${field.Type.toUpperCase()} NOT NULL AUTO_INCREMENT, `; ifPri = true; priField = field.Field;
                    }
                    if(field.Type == 'date' && field.Field == 'created_at') queryString += `${field.Field} TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `;
                    if(field.Type == 'date' && field.Field == 'updated_at') queryString += `${field.Field} TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `;
                    if(field.Type != 'date' &&  field.Key != 'PRI') {
                        queryString += `${field.Field} ${field.Type.toUpperCase()} ${field.Null}, `;
                    }
                    if(count == element.table_fields.length - 1) {
                        if(ifPri) queryString += `PRIMARY KEY (${priField}));`;
                        else queryString += `);`;
                    }
                    count++;
                });
                //console.log(queryString);
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

    module.buildTables = function(req, res) {
        const GET_DATABASE_TABLES = `SELECT table_name FROM information_schema.tables where table_schema='${database}';`;
        connection.query(GET_DATABASE_TABLES, (err, results) => {
            if(err) {
                console.log(err);
                //return res.send(err);
            } else {
                if(results[0] == undefined) {
                    addAndRemoveTables(tablesAndRowsDb, tablesAndRowsConfig.sort(compare));
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
                                //console.log(tablesAndRowsDb.length + ', ' + results.length);
                                if(tablesAndRowsDb.length == results.length) {
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
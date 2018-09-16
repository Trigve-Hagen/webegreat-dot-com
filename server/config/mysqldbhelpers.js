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

    function createDbObject(results) {

        return tablesAndRowsDb;
    }

    function compareObjects(tablesAndRowsDb, tablesAndRowsConfig) {

    }

    function resolveDifferences(diff) {
        switch(diff) {

        }
    }

    module.listObjTables = function(req, res) {
        console.log("In ListObjTables");
    }

    module.listDbTables = function(req, res) {
        const GET_DATABASE_TABLES = `SELECT table_name FROM information_schema.tables where table_schema='${database}';`;
        connection.query(GET_DATABASE_TABLES, (err, results) => {
            if(err) {
                console.log(err);
                //return res.send(err);
            } else {
                //console.log(results);
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
                            console.log(tablesAndRowsDb.length + ', ' + results.length);
                            if(tablesAndRowsDb.length == results.length) {
                                console.log(tablesAndRowsConfig.sort(compare));
                                console.log(tablesAndRowsDb);
                            }
                            //console.log(element.table_name);
                            //console.log(rowResults);
                        }
                    });
                });
                //console.log(count);
                
                //console.log(tablesAndRowsDb);
                //console.log(tablesAndRowsConfig.sort(compare));
                //return res.json({
                    //data: results
                //});
            }
        });
    }

    return module;
};
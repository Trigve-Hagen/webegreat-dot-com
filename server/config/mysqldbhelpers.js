module.exports = function(database, config, connection) {
    var module = {};
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
                console.log(results);
                //return res.json({
                    //data: results
                //});
            }
        });
    }
    return module;
};
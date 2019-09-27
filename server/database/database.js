var mysql=require("mysql");
var config=require("./mysql_config");

var connection=mysql.createConnection(config);

/*
connection.connect(error=>{
    if(error) throw error;
    console.log("Database connected");
});

connection.end(error=>{
    if(error) throw error;
    console.log("Connection closed");
});
*/

module.exports=connection;
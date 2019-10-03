var mysql=require("mysql");
var config=require("./mysql_config");

var connection=mysql.createConnection(config);

module.exports=connection;
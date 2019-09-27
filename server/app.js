// import all the npm packages which will be used.
const express=require("express")
const uuid=require("uuid/v4");
const bcrypt = require("bcrypt");


const db=require("./database/database");
const sms=require("./sms/sms");
const email=require("./email/email");

const app=express()
const port=6900

// Middleware added to all routes to support Cross Origin Resource Sharing.
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Middleware to accept post requests.
app.use(express.json());

// All the routes here.
// Pass all the parameters that are required for routes
require('./routes/hello')(app);
require('./routes/Student/account')(app,db,uuid,bcrypt,email,sms);

// Start the server. Along with that call the stored procedure to create tables.
app.listen(port,"0.0.0.0",()=>{
    console.log("Server started!");
    db.query("call createTables()",(error,result)=>{
        if(error) throw error;
    });
    console.log("Database tables initiated");
});


// Demo email and sms
//sms("+919980181168","hello from adithya");
//email("adithyabhatoct@gmail.com","hello","email!");(parameters are emailid,subject,text)
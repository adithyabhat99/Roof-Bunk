const express=require('express')
const db=require("./database");

const app=express()
const port=6000


// Middleware added to all routes to support Cross Origin Resource Sharing.
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Pass all the parameters that are required for routes
require('./routes/hello')(app);

// Start the server. Along with that call the stored procedure to create tables.
app.listen(port,()=>{
    console.log("Server started!");
    db.query("call createTables()",(error,result)=>{
        if(error) throw error;
    });
    console.log("Database tables initiated");
});
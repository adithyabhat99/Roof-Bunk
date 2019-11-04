// import all the npm packages which will be used.
const express=require("express")
const jwt=require("jsonwebtoken");
const multer=require("multer");
const fs=require("fs");
const path = require("path");
const datetime=require("node-datetime");
const db=require("./database/database");
const sms=require("./sms/sms");
const email=require("./email/email");
const upload=multer({dest:"Pictures/"});
const app=express()
const port=6900

// Middleware added to all routes to support Cross Origin Resource Sharing.
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods","POST, PUT, GET, OPTIONS");
    next();
});
// Middleware to accept post requests.
app.use(express.json());

// Middleware to verify auth tokens.
// Use this middleware in all the routes except login,create account,verify email/number.
// This is for student account only
function auth(req,res,next){
    const config=require("./auth_config");
    let token=req.headers["x-access-token"]||req.headers["authorization"];
    if (token.startsWith('Bearer ')) 
    {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (token) 
    {
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) 
          {
            res.statusCode=401;
            return res.json({
              "error": "Token is not valid"
            });
          } 
          else 
          {
            req.decoded = decoded;
            if(decoded["type"]!="student")
            {
              res.statusCode=401;
              return res.json({
                "error": "Token is not valid,user is not a student"
              });
            }
            next();
          }
        });
      } 
      else 
      {
        res.statusCode=400;
        return res.json({
          "error": "Auth token is not supplied"
        });
      }
}
// Same middleware for pg owner with just a single difference to verify user is a pg owner
function auth_pg(req,res,next){
  const config=require("./auth_config");
  let token=req.headers["x-access-token"]||req.headers["authorization"];
  if (token.startsWith('Bearer ')) 
  {
      // Remove Bearer from string
      token = token.slice(7, token.length);
  }
  if (token) 
  {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) 
        {
          res.statusCode=401;
          return res.json({
            "error": "Token is not valid"
          });
        } 
        else 
        {
          req.decoded = decoded;
          if(decoded["type"]!="pg")
          {
            res.statusCode=401;
            return res.json({
              "error": "Token is not valid,user is not a pg owner"
            });
          }
          next();
        }
      });
    } 
    else 
    {
      res.statusCode=400;
      return res.json({
        "error": "Auth token is not supplied"
      });
    }
}

// All the routes here.
// Pass all the parameters that are required for routes
require("./routes/hello")(app);
require("./routes/Student/account")(app,db,email,sms,auth,fs,path);
require("./routes/Student/auth")(app,db,email,sms,auth);
require("./routes/Student/review")(app,db,email,sms,auth,datetime);
require("./routes/Student/bookmark")(app,db,email,sms,auth,datetime);
require("./routes/Student/notifications")(app,db,email,sms,auth);
require("./routes/Student/message")(app,db,email,sms,auth,datetime);
require("./routes/Student/picture")(app,db,auth,upload,fs,path);
require("./routes/Services/home")(app,db,auth);
require("./routes/Services/pg_details")(app,db,auth);
require("./routes/Services/pg_pictures")(app,db,auth,fs,path);
require("./routes/Services/search")(app,db,auth);
require("./routes/Services/rooms")(app,db,auth);
require("./routes/Services/top_rated")(app,db,auth);
require("./routes/Services/avg_rating")(app,db,auth);
require("./routes/PG/account")(app,db,email,sms,auth_pg,fs,path);
require("./routes/PG/auth")(app,db,email,sms);
require("./routes/PG/reviews")(app,db,email,sms,auth_pg);
require("./routes/PG/notifications")(app,db,email,sms,auth_pg);
require("./routes/PG/message")(app,db,email,sms,auth_pg,datetime);
require("./routes/PG/picture")(app,db,auth_pg,upload,fs,path);
require("./routes/PG/rooms")(app,db,email,sms,auth_pg);
// The routes below require verify_token as middleware.


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
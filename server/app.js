// import all the npm packages which will be used.
const express=require("express")
const jwt=require("jsonwebtoken");

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

// Middleware to verify auth tokens.
// Use this middleware in all the routes except login,create account,verify email/number.
function verify_token(req,res,next){
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
require("./routes/Student/account")(app,db,email,sms);
require("./routes/Student/auth")(app,db,email,sms);
require("./routes/PG/account")(app,db,email,sms);
require("./routes/PG/auth")(app,db,email,sms);
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
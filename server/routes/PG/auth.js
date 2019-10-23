// This file contains routes to login,verify email,phone of the student
// Login is possible only if account is verified(email or phone).

module.exports=(app,db,email,sms,auth)=>{
    const auth_config=require("../../auth_config");
    const jwt=require("jsonwebtoken");
    const bcrypt=require("bcrypt");

    app.post("/api/pg/login",(req,res)=>{
        const username=req.body.username;
        const passw=req.body.password;
        if(!username || !passw)
        {
            res.statusCode=401;
            res.json({"error":"send username(email/phoneno) and password"});
            return;
        }
        query1=`select count(*) from Owner where (Email='${username}' and EVerified=1) or (Contact='${username}' and Verified=1)`;
        query2=`select PGID,Password from Owner where Email='${username}' or Contact='${username}'`;
        db.query(query1,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"problem occured"});
                return;
            }
            if(result[0]["count(*)"]==0)
            {
                res.statusCode=401;
                res.json({"error":"verify your email/number to log in"});
                return;
            }
            db.query(query2,(error,result)=>{
                if(error)
                {
                    res.statusCode=400;
                    res.json({"error":"problem occured"});
                    return;
                }
                const hashed_pass=result[0]["Password"];
                const UID=result[0]["UID"];
                bcrypt.compare(passw,hashed_pass,(err,r)=>{
                    if(r==false)
                    {
                        res.statusCode=401;
                        res.json({"eroor":"wrong passwod"});
                    }
                    const token=jwt.sign({
                        exp:Math.floor(Date.now()/1000)+(31*7*24*60*60),
                        uid:UID,
                        type:"pg"
                    },auth_config["secret"]);
                    res.statusCode=200;
                    res.json({"message":"success","token":token});
                });
            });
        });
    });
    // Route to verify email.
    app.post("/api/pg/verify/email",(req,res)=>{
        const otp=req.body.otp;
        const mail=req.body.email;
        query1=`update Owner set EVerified=1 where Email='${mail}' and EOTP='${otp}'`;
        query2=`select PGID from Owner where Email='${mail}'`;
        db.query(query1,(error,result)=>{
            if(error)
            {
                res.statusCode=401;
                res.json({"error":"could not verify"});
                return;
            }
            db.query(query2,(error,result)=>{
                if(error)
                {
                    res.statusCode=401;
                    res.json({"error":"could not verify"});
                    return;
                }
                const UID=result[0]["PGID"];
                const token=jwt.sign({
                    exp:Math.floor(Date.now()/1000)+(31*7*24*60*60),
                    uid:UID,
                    type:"pg"
                },auth_config["secret"]);
                res.statusCode=200;
                res.json({"message":"success","token":token});
            });
        });
        email(mail,"Email Verified","Your email verification is successful");
    });

    // Route to verify phone number.
    app.post("/api/pg/verify/number",(req,res)=>{
        const otp=req.body.otp;
        const number=req.body.number;
        query1=`update Owner set Verified=1 where Contact='${number}' and OTP='${otp}'`;
        query2=`select PGID from Owner where Contact='${number}'`;
        db.query(query1,(error,result)=>{
            if(error)
            {
                res.statusCode=401;
                res.json({"error":"could not verify"});
                return;
            }
            db(query2,(error,result)=>{
                if(error)
                {
                    res.statusCode=401;
                    res.json({"error":"could not verify"});
                    return;
                }
                const UID=result[0]["UID"];
                const token=jwt.sign({
                    exp:Math.floor(Date.now()/1000)+(31*7*24*60*60),
                    uid:UID,
                    type:"pg"
                },auth_config["secret"]);
                res.statusCode=200;
                res.json({"message":"success","token":token});
            })
        });
        //sms("+91"+number,"Your Roof and Bunk phone number is verified");
    });
    app.put("/api/pg/reset/password",(req,res)=>{
        const username=req.body.username;
        if(!username)
        {
            res.statusCode=401;
            res.json({"error":"send username(email/number)"});
            return;
        }
        const OTP=(Math.floor(Math.random()*9000+1000)).toString();
        let query=`update Owner set OTP='${OTP}',EOTP='${OTP}' where Email='${username}' or Contact='${username}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=401;
                res.json({"error":"error occured"});
                return;
            }
            email(username,"Reset Password",`Enter the OTP to reset password\nOTP:${OTP}`);
            //sms("+91"+username,`Enter the OTP to reset password,OTP:'${OTP}'`);
            res.statusCode=200;
            res.json({"message":"success"});
        });
    });
    app.post("/api/pg/reset/password",(req,res)=>{
        const username=req.body.username;
        const OTP=req.body.otp;
        const passw=req.body.password;
        if(!username || !OTP || !passw)
        {
            res.statusCode=401;
            res.json({"error":"send username(email/number), otp and password"});
            return;
        }
        let query1=`select OTP from Owner where Email='${username}' or Contact='${username}'`;
        db.query(query1,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            let o=result[0]["OTP"];
            if(!o)
            {
                res.statusCode=400;
                res.json({"error":"wrong username"});
                return;
            }
            if(o!=OTP)
            {
                res.statusCode=400;
                res.json({"error":"wrong otp"});
                return; 
            }
            const password=bcrypt.hashSync(passw,10);
            let query2=`update Owner set Password='${password}' where Email='${username}' or Contact='${username}'`;
            db.query(query2,(error2,result2)=>{
                if(error)
                {
                    res.statusCode=401;
                    res.json({"error":"error occured"});
                    return;
                }
                email(username,"Password reset success","Your password has been reset");
                //sms("+91"+username,"Your password reset is successful"`);
                res.statusCode=200;
                res.json({"message":"success"}); 
            });
        });
    });
}
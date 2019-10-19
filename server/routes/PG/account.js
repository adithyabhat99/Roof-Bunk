// This file contains routes to Create,Delete,Retrieve,Update PG account.
module.exports=(app,db,email,sms,auth)=>{
    const uuid=require("uuid/v4");
    const bcrypt = require("bcrypt");

    // Route create a PG account.(POST Method)
    // It returns UID of the PG after successful creation of account.
    // Later the PG needs to verify email/phone number to successfully log in.
    app.post("/api/pg/account",(req,res)=>{
        if(!req.body.ownername || !req.body.pgname)
        {
            res.statusCode=400;
            res.json({"error":"pg and owner name required"});
            return;
        }
        if(!req.body.email && !req.body.number)
        {
            res.statusCode=400;
            res.json({"error":"email or phone number is required"});
            return;
        }
        if(!req.body.password)
        {
            res.statusCode=400;
            res.json({"error":"password is required"});
            return;
        }
        if(!req.body.gender)
        {
            res.statusCode=400;
            res.json({"error":"gender is required"});
            return;
        }
        if(!req.body.lat || !req.body.lng)
        {
            res.statusCode=400;
            res.json({"error":"latitude and longitude required"});
            return;
        }
        const uid=uuid().toString();
        const pgname=req.body.pgname;
        const ownername=req.body.ownername;
        // Keep uid as email/phone when they are null
        const mail=(req.body.email)?req.body.email:uid;
        const number=(req.body.number)?req.body.number:uid;
        const gender=req.body.gender;
        const password=bcrypt.hashSync(req.body.password,10);
        // OTPs will be changed when user updates email/phone
        const OTP=(Math.floor(Math.random()*9000+1000)).toString();
        const EOTP=(Math.floor(Math.random()*9000+1000)).toString();
        const lat=req.body.lat;
        const lng=req.body.lng;
        query=`insert into Owner(PGID,Pg_name,Owner_name,Contact,Email,Password,Gender,OTP,EOTP,lat,lng) 
        values('${uid}','${pgname}','${ownername}','${number}','${mail}','${password}','${gender}','${OTP}','${EOTP}','${lat}','${lng}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"problem occured"});
                return;
            }
            if(mail!=uid)
            {
                email(mail,"Verify Email",`Thank you for registering your PG on Roof and Bunk,Please verify email\n OTP: ${EOTP}`);
            }
            if(number!=uid)
            {
                // Commented below because an SMS costs $0.04, only $14 is free, use this only when required.
                //sms("+91"+number,`Thank you for registering your PG on Roof and Bunk,Please verify your number\n OTP: ${OTP}`)
            }
            res.statusCode=200;
            res.json({"message":"success","uid":uid.toString(),"type":"PG"});
        });
    });
    // Not tested.
    app.delete("/api/pg/account",auth,(req,res)=>{
        pgid=req.decoded["pgid"];
        query=`delete from Owner where PGID=${pgid}`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=401;
                res.json({"error":"could not delete account"});
                return;
            }
            res.statusCode=200;
            res.json({"success":"account deleted"});
        });
    });
}
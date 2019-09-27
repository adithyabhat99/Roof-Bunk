// This file contains routes to Create,Delete,Retrieve,Update student account.
module.exports=(app,db,email,sms)=>{
    const uuid=require("uuid/v4");
    const bcrypt = require("bcrypt");

    // Route create a student account.(POST Method)
    // It returns UID of the student after successful creation of account.
    // Later the student needs to verify email/phone number to successfully log in.
    app.post("/api/student/account",(req,res)=>{
        if(!req.body.name)
        {
            res.statusCode=400;
            res.json({"error":"name required"});
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
        if(!req.body.dob)
        {
            res.statusCode=400;
            res.json({"error":"date of birth is required"});
            return;
        }
        const uid=uuid().toString();
        const name=req.body.name;
        // Keep uid as email/phone when they are null
        const mail=(req.body.email)?req.body.email:uid;
        const number=(req.body.number)?req.body.number:uid;
        const gender=req.body.gender;
        const dob=req.body.dob;
        const password=bcrypt.hashSync(req.body.password,10);
        // OTPs will be changed when user updates email/phone
        const OTP=(Math.floor(Math.random()*9000+1000)).toString();
        const EOTP=(Math.floor(Math.random()*9000+1000)).toString();
        query=`insert into Student(UID,Name,Contact_number,Email,Password,Gender,DOB,OTP,EOTP) 
        values('${uid}','${name}','${number}','${mail}','${password}','${gender}','${dob}','${OTP}','${EOTP}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"problem occured"});
                return;
            }
            if(mail!=uid)
            {
                email(mail,"Verify Email",`Welcome to Roof and Bunk,Please verify email\n OTP: ${EOTP}`);
            }
            if(number!=uid)
            {
                // Commented below because an SMS costs $0.04, only $14 is free, use this only when required.
                //sms("+91"+number,`Welcome to Roof and Bunk,Please verify your number\n OTP: ${OTP}`)
            }
            res.statusCode=200;
            res.json({"message":"success","uid":uid.toString()});
        });
    });

}
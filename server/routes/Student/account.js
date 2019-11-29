// This file contains routes to Create,Delete,Retrieve,Update student account.
module.exports=(app,db,email,sms,auth,fs,path)=>{
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
                console.log(error);
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
                // sms("+91"+number,`Welcome to Roof and Bunk,Please verify your number\n OTP: ${OTP}`);
            }
            res.statusCode=200;
            res.json({"message":"success","uid":uid.toString(),"type1":"student"});
        });
    });
    app.delete("/api/student/account",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let query=`call delete_stud('${uid}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=401;
                res.json({"error":"could not delete account"});
                return;
            }
            try{
                fs.unlinkSync(__dirname+"/../../Pictures/"+uid+".jpg");
                res.statusCode=200;
                res.json({"message":"success"});
            }
            catch(err){
                res.statusCode=200;
                res.json({"message":"success"});
            }
        });
    });
    app.put("/api/student/account",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let name=req.body.name;
        let Email=req.body.email;
        let number=req.body.number;
        let gender=req.body.gender;
        let dob=req.body.dob;
        let query=`update Student set `;
        let array=[];
        if(name!=null)
        {
            array.push(`Name='${name}'`);
        } 
        if(Email!=null)
        {
            const EOTP=(Math.floor(Math.random()*9000+1000)).toString();
            array.push(`Email='${Email}',Everified='0',EOTP='${EOTP}'`);
            email(Email,"Verify Email",`Please verify your email\n OTP:${EOTP}`);
        }
        if(number!=null)
        {
            const OTP=(Math.floor(Math.random()*9000+1000)).toString();
            array.push(`Contact_number='${number}',Verified='0',OTP='${OTP}'`); 
            // sms("+91"+number,`Please verify your number\n OTP: ${OTP}`);
        }
        if(gender!=null)
        {
            array.push(`Gender='${gender}'`);
        }
        if(dob!=null)
        {
            array.push(`DOB='${dob}'`);
        }
        if(array.length==0)
        {
            res.statusCode=400;
            res.json({"error":"send atleast one attribute out of name,email,number,gender,dob"});
            return;
        }
        query+=array[0];
        for(i=1;i<array.length;i++)
        {
            query+=","+array[i];
        }
        query+=` where UID='${uid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occered"});
                return;
            }
            res.statusCode=200;
            res.json({"message":"success","uid":uid.toString(),"type1":"student"});
        });
    });
    app.get("/api/student/account",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let query=`select UID,Name,Contact_number,Email,Gender,DOB from Student where UID='${uid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"an error occered"});
                return;
            }
            res.statusCode=200;
            res.json({"details":result[0]});
        });
    });
}
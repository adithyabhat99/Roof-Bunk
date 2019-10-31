// This file contains routes to Create,Delete,Retrieve,Update PG account.
module.exports=(app,db,email,sms,auth,fs,path)=>{
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
        query=`insert into Owner(PGID,pgname,ownername,Contact,Email,Password,Gender,OTP,EOTP,lat,lng) 
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
    app.delete("/api/pg/account",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let query1=`select photo from PG_Pictures where PGID='${pgid}'`;
        db.query(query1,(error,result)=>{
            if(error)
            {
                console.log(error);
                return;
            }
            for(i=0;i<result.length;i++)
            {
                try{
                    fs.unlinkSync(__dirname+"/../../Pictures/"+result[i]["photo"]);
                }
                catch(err){
                }
            }
        });
        let query=`delete from Owner where PGID=${pgid}`;
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
    app.put("/api/pg/account",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let pgname=req.body.pgname;
        let ownername=req.body.ownername;
        let number=req.body.number;
        let Email=req.body.email;
        let desc=req.body.desc;
        let lat=req.body.lat;
        let lng=req.body.lng;
        let gender=req.body.gender;
        let bathroom=req.body.bathroom;
        let wifi=req.body.wifi;
        let ac=req.body.ac;
        let meals=req.body.meals;
        let laundry=req.body.laundry;
        let maid=req.body.maid;
        let s_p=req.body.students_preffered;
        let query=`update Owner set `;
        array=[];
        if(pgname!=null)
        {
            array.push(`Pg_name='${pgname}'`);
        }
        if(ownername!=null)
        {
            array.push(`Owner_name='${ownername}'`);
        }
        if(number!=null)
        {
            const OTP=(Math.floor(Math.random()*9000+1000)).toString();
            array.push(`Contact='${number}',Verified='0',OTP='${OTP}'`); 
            // sms("+91"+number,`Please verify your number\n OTP: ${OTP}`);
        }
        if(Email!=null)
        {
            const EOTP=(Math.floor(Math.random()*9000+1000)).toString();
            array.push(`Email='${Email}',Everified='0',EOTP='${EOTP}'`);
            email(Email,"Verify Email",`Please verify your email\n OTP:${EOTP}`);
        }
        if(desc!=null)
        {
            array.push(`Description='${desc}'`);
        }
        if(lat!=null && lng!=null)
        {
            array.push(`lat='${lat}',lng='${lng}'`);
        }
        if(gender!=null)
        {
            array.push(`Gender='${gender}'`);
        }
        if(bathroom!=null)
        {
            array.push(`Bathroom='${bathroom}'`);
        }
        if(wifi!=null)
        {
            array.push(`Wifi='${wifi}'`);
        }
        if(ac!=null)
        {
            array.push(`AC='${ac}'`);
        }
        if(meals!=null)
        {
            array.push(`Meals='${meals}'`);
        }
        if(laundry!=null)
        {
            array.push(`Laundry='${laundry}'`);
        }
        if(maid!=null)
        {
            array.push(`Maid='${maid}'`);
        }
        if(s_p!=null)
        {
            array.push(`students_preffered='${s_p}'`);
        }
        if(array.length==0)
        {
            res.statusCode=400;
            res.json({"error":"send atleast one attribute out of ownername,pgname,email,number,gender,wifi,bathroom,meals,students_preffered,ac,lat,lng"});
            return;
        }
        query+=array[0];
        for(i=1;i<array.length;i++)
        {
            query+=","+array[i];
        }
        query+=` where PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occered"});
                console.log(error)
                return;
            }
            res.statusCode=200;
            res.json({"message":"success"});
        });
    });
    app.get("/api/pg/account",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        query=`select Pg_name,Owner_name,Contact,Email,Description,lat,lng,Gender,Bathroom,Wifi,AC,Meals,Laundry,Maid,students_preffered,avg(rating) as avg_rating from Owner inner join reviews on Owner.PGID=reviews.PGID and Owner.PGID='${pgid}'`;
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
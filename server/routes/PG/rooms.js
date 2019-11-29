module.exports=(app,db,email,sms,auth)=>{
    app.post("/api/pg/rooms",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let empty1=req.body.empty1;
        let type1=req.body.type1;
        let price=req.body.price;
        if(!empty1 || !type1 || !price)
        {
            res.statusCode=400;
            res.json({"error":"send type1,empty1,price of room"});
            return;
        }
        let query=`insert into Room values('${pgid}','${empty1}','${type1}','${price}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            res.json({"message":"success"});
        });
    });
    app.put("/api/pg/rooms",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let empty1=req.body.empty1;
        let type1=req.body.type1;
        let price=req.body.price;
        if(!empty1 && !type1 && !price)
        {
            res.statusCode=400;
            res.json({"error":"send type1 as well as atleast one of empty1,price"});
            return;
        }
        let query=`update Room set `;
        let a=[]
        if(empty1)
        {
            a.push(`Empty1='${empty1}'`);
        }
        if(price)
        {
            a.push(`Price='${price}'`);
        }
        query+=a[0];
        for(i=1;i<a.length;i++)
        {
            query+=","+a[i];
        }
        query+=` where PGID='${pgid}' and Type1='${type1}'`;
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
    app.delete("/api/pg/rooms",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let type1=req.body.type1;
        if(!type1)
        {
            res.statusCode=400;
            res.json({"error":"send type1"});
            return;
        }
        let query=`delete from Room where PGID='${pgid}' and Type1='${type1}'`;
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
    app.get("/api/pg/rooms",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let query=`select * from Room where PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occered"});
                console.log(error)
                return;
            }
            res.statusCode=200;
            res.json({"rooms":result});
        });
    });
}
module.exports=(app,db,email,sms,auth)=>{
    app.post("/api/pg/rooms",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let empty=req.body.empty;
        let type=req.body.type;
        let price=req.body.price;
        if(!empty || !type || !price)
        {
            res.statusCode=400;
            res.json({"error":"send type,empty,price of room"});
            return;
        }
        let query=`insert into Room values('${pgid}','${empty}','${type}','${price}')`;
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
        let empty=req.body.empty;
        let type=req.body.type;
        let price=req.body.price;
        if(!empty && !type && !price)
        {
            res.statusCode=400;
            res.json({"error":"send type as well as atleast one of empty,price"});
            return;
        }
        let query=`update Room set `;
        let a=[]
        if(empty)
        {
            a.push(`Empty='${empty}'`);
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
        query+=` where PGID='${pgid}' and Type='${type}'`;
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
        let type=req.body.type;
        if(!type)
        {
            res.statusCode=400;
            res.json({"error":"send type"});
            return;
        }
        let query=`delete from Room where PGID='${pgid}' and type='${type}'`;
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
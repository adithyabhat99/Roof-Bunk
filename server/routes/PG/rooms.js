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
}
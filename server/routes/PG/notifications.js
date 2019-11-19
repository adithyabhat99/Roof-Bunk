module.exports=(app,db,email,sms,auth)=>{
    app.get("/api/pg/notifications",auth,(req,res)=>{
        let num=(req.body.num!=null)?req.body.num*10:0;
        let pgid=req.decoded["uid"];
        let query=`select id,type,message,ndate,read_status from pg_notifications where PGID='${pgid}' and read_status=0 order by ndate desc limit ${num},10`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error eccured"});
            }
            res.statusCode=200;
            res.json(result); 
        });
    });
    app.put("/api/pg/notifications",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let query=`update pg_notifications set read_status=1 where PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error eccured"});
            }
            res.statusCode=200;
            res.json({"message":"success"}); 
        });
    });
}
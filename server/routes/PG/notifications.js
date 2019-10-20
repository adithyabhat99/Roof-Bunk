module.exports=(app,db,email,sms,auth)=>{
    app.get("/api/pg/notifications",auth,(req,res)=>{
        let num=(req.body.num!=null)?req.body.num*10:0;
        let pgid=req.decoded["uid"];
        let query=`select type,message,ndate from pg_notifications where PGID='${pgid}' order by ndate desc limit ${num},10`;
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
    
}
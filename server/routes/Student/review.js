module.exports=(app,db,email,sms,auth,datetime)=>{
    app.post("/api/student/review",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let review=req.body.review;
        let rating=req.body.rating;
        let uid=req.decoded["uid"];
        if(!pgid || !review || !rating)
        {
            res.statusCode=400;
            res.json({"error":"pgid,review,rating required"});
            return;
        }
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        query=`insert into reviews values('${uid}','${pgid}','${review}','${rating}','${now}')`;
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
    app.put("/api/student/review",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let review=req.body.review;
        let rating=req.body.rating;
        let uid=req.decoded["uid"];
        if(!pgid || !review || !rating)
        {
            res.statusCode=400;
            res.json({"error":"pgid,review,rating required"});
            return;
        }
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        query=`update reviews set review='${review}',rating='${rating}',rdate='${now}' where UID='${uid}' and PGID='${pgid}'`;
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
    })
    app.delete("/api/student/review",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let uid=req.decoded["uid"];
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        query=`delete from reviews where UID='${uid}' and PGID='${pgid}'`;
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
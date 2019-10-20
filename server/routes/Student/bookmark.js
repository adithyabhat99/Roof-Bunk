module.exports=(app,db,email,sms,auth,datetime)=>{
    app.post("/api/student/bookmark",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let pgid=req.body.pgid;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        let query=`insert into bookmarks values('${uid}','${pgid}','${now}')`;
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
    app.get("/api/student/bookmark",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let query=`select * from bookmarks where UID='${uid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            res.json(result);
        });
    });
    app.delete("/api/student/bookmark",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let pgid=req.body.pgid;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        let query=`delete from bookmarks where UID='${uid}' and PGID='${pgid}'`;
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
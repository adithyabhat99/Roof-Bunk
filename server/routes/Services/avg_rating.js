module.exports=(app,db,auth)=>{
    app.post("/api/student/avg_rating",(req,res)=>{
        let pgid=req.body.pgid;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"send pgid"});
        }
        let query=`select avg(rating) from reviews where PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"an error occured"})
                return;
            }
            res.statusCode=200;
            res.json({"rating":result[0]["avg(rating)"]});
        });
    });
}
module.exports=(app,db)=>{
    app.get("/api/name",(req,res)=>{
        let type=req.query.type;
        let id=req.query.id;
        if(!type || !id)
        {
            res.statusCode=400;
            res.json({"error":"send type and id"});
            return;
        }
        if(type=="pg")
        {
            db.query(`select Pg_name from Owner where PGID='${id}'`,(error,result)=>{
                if(error)
                {
                    res.statusCode=400;
                    res.json({"error":"an error occured"});
                    return;
                }
                res.statusCode=200;
                res.json({"name":result[0]["Pg_name"]});
            });
        }
        else
        {
            db.query(`select Name from Student where UID='${id}'`,(error,result)=>{
                if(error)
                {
                    res.statusCode=400;
                    res.json({"error":"an error occured"});
                    return;
                }
                res.statusCode=200;
                res.json({"name":result[0]["Name"]});
            });
        }
    })
}
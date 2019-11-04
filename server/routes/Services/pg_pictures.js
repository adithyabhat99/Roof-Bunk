module.exports=(app,db,auth,fs,path)=>{
    app.get("/api/student/pg_pictures",auth,(req,res)=>{
        let pgid=req.body.pgid;
        query=`select Photo from PG_Pictures where PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            if(result.length==0)
            {
                res.json({"pictures":["default_pg.jpg"]})
            }
            else
            {
                res.json({"pictures":result});
            }
        });
    });
    app.post("/api/student/pg_picture_1",auth,(req,res)=>{
        let pgid=req.body.pgid;
        query=`select Photo from PG_Pictures where PGID='${pgid}' limit 0,1`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            if(result.length==0)
            {
                res.sendFile(path.resolve(__dirname+"/../../Pictures/default_pg.jpg"));
            }
            else
            {
                let filename=result[0]["Photo"];
                let p=path.resolve(__dirname+"/../../Pictures/"+filename);
                if(fs.existsSync(path.resolve(__dirname+"/../../Pictures/"+filename)))
                {
                    res.statusCode=200;
                    res.sendFile(p);
                }
                else
                {
                    res.statusCode=400;
                    res.sendFile(path.resolve(__dirname+"/../../Pictures/default_pg.jpg"));
                }
            }
        });
    });
    app.post("/api/student/pg_picture",auth,(req,res)=>{
        let filename=req.body.filename;
        if(!filename)
        {
            res.statusCode=400;
            res.json({"error":"filename required"});
            return;
        }
        let p=path.resolve(__dirname+"/../../Pictures/"+filename);
        if(fs.existsSync(path.resolve(__dirname+"/../../Pictures/"+filename)))
        {
            res.statusCode=200;
            res.sendFile(p);
        }
        else
        {
            res.statusCode=400;
            res.sendFile(path.resolve(__dirname+"/../../Pictures/default_pg.jpg"));
        }
    });
}
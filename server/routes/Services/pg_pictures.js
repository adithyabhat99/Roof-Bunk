module.exports=(app,db,auth,fs,path)=>{
    app.get("/api/student/pg_pictures",auth,(req,res)=>{
        let pgid=req.body.pgid;
        query=`select * from PG_Pictures where PGID='${pgid}'`;
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
    app.get("/api/student/pg_picture",auth,(req,res)=>{
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
            res.sendFile(path.resolve(__dirname+"/../../Pictures/default.jpg"));
        }
    });
}
module.exports=(app,db,auth,upload,fs,path)=>{
    const uuid=require("uuid/v4");
    app.post("/api/pg/picture",auth,upload.single("file"),(req,res)=>{
        let filename=req.file["filename"];
        let PGID=req.decoded["uid"];
        let pid=uuid().toString();
        fs.rename(__dirname+"/../../Pictures/"+filename,__dirname+"/../../Pictures/"+pid+".jpg",(err)=>{
            if(err)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            filename=pid+".jpg";
            let query=`insert into PG_Pictures values('${PGID}','${filename}')`;
            db.query(query,(error,result)=>{
                if(error)
                {
                    res.statusCode=400;
                    res.json({"error":"error occured"});
                    return;
                }
                res.statusCode=200;
                res.json({"message":"success","filename":filename});
            });
        });
    });
    app.delete("/api/pg/picture",auth,(req,res)=>{
        let PGID=req.decoded["uid"];
        let filename=req.body.filename;
        if(!filename)
        {
            res.statusCode=400;
            res.json({"error":"filename required"});
            return;
        }
        query=`delete from PG_Pictures where PGID='${PGID}' and photo='${filename}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            try{
                fs.unlinkSync(__dirname+"/../../Pictures/"+filename);
                res.statusCode=200;
                res.json({"message":"success"});
            }
            catch(err){
                res.statusCode=200;
                res.json({"message":"success"});
            }
        });
    });
    app.get("/api/pg/pictures",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        query=`select photo from PG_Pictures where PGID='${pgid}'`;
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
    app.put("/api/pg/picture",auth,(req,res)=>{
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
    app.put("/api/pg/student_picture",auth,(req,res)=>{
        let uid=req.body.uid;
        if(!uid)
        {
            res.statusCode=400;
            res.json({"error":"send uid"});
            return;
        }
        let p=path.resolve(__dirname+"/../../Pictures/"+uid+".jpg");
        if(fs.existsSync(path.resolve(__dirname+"/../../Pictures/"+uid+".jpg")))
        {
            res.statusCode=200;
            res.sendFile(p);
        }
        else
        {
            res.statusCode=200;
            res.sendFile(path.resolve(__dirname+"/../../Pictures/default.jpg"));
        }
    });
}
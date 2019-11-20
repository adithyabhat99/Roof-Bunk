module.exports=(app,db,auth,upload,fs,path)=>{
    app.post("/api/student/picture",auth,upload.single("file"),(req,res)=>{
        let filename=req.file["filename"];
        let uid=req.decoded["uid"];
        fs.rename(__dirname+"/../../Pictures/"+filename,__dirname+"/../../Pictures/"+uid+".jpg",(err)=>{
            if(err)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            filename=uid+".jpg";
            let query=`update Student set Photo='${filename}' where UID='${uid}'`;
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
    });
    app.delete("/api/student/picture",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        query=`update Student set Photo=NULL where UID='${uid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            try{
                fs.unlinkSync(__dirname+"/../../Pictures/"+uid+".jpg");
                res.statusCode=200;
                res.json({"message":"success"});
            }
            catch(err){
                res.statusCode=200;
                res.json({"message":"success"});
            }
        });
    });
    app.get("/api/student/picture",auth,(req,res)=>{
        let uid=req.decoded["uid"];
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
    app.put("/api/student/student_picture",auth,(req,res)=>{
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
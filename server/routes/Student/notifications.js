module.exports=(app,db,email,sms,auth)=>{
    app.get("/api/student/notifications",auth,(req,res)=>{
        let num=(req.body.num!=null)?req.body.num*10:0;
        let uid=req.decoded["uid"];
        let query=`select id,type,message,ndate,read_status from student_notifications where UID='${uid}' and read_status=0  order by ndate desc limit ${num},10`;
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
    app.put("/api/student/notifications",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let query=`update student_notifications set read_status=1 where UID='${uid}'`;
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
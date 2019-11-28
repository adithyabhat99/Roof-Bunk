module.exports=(app,db,email,sms,auth,datetime)=>{
    app.post("/api/student/message",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let uid=req.decoded["uid"];
        let message=req.body.message;
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        if(!pgid || !message)
        {
            res.statusCode=400;
            res.json({"error":"pgid and message required"});
            return;
        }
        query=`insert into messages(sender_type,sender_id,reciever_id,mdate,message) values('S','${uid}','${pgid}','${now}','${message}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
              res.statusCode=400;
              res.json({"error":"error occured"});
              console.log(error)
              return;  
            }
            res.statusCode=200;
            res.json({"message":"success"});
        });
        let query2=`select Email,Contact from Owner where PGID='${pgid}'`;
            db.query(query2,(e,r)=>{
                if(e)
                {
                    return;
                }
                let email_id=r[0]["Email"];
                email(email_id,"Message","Hey,there is a new message for you");
        });
    });
    app.delete("/api/student/message",auth,(req,res)=>{
        let mid=req.body.mid;
        let uid=req.decoded["uid"];
        if(!mid)
        {
            res.statusCode=400;
            res.json({"error":"mid required"});
            return;    
        }
        let query=`delete from messages where sender_id='${uid}' and id='${mid}'`;
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
    app.get("/api/student/messages",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let num=(req.body.num!=null)?req.body.num*10:0;
        let query=`select distinct PGID,Pg_name from (select sender_id from messages where reciever_id='${uid}' order by mdate desc) A inner join Owner on sender_id=PGID`;
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
    app.put("/api/student/message",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let sid=req.body.sid;
        let num=(req.body.num!=null)?req.body.num*10:0;
        if(!sid)
        {
            res.statusCode=400;
            res.json({"error":"please send sender id"});
            return;
        }
        let query=`select id,message,mdate,reciever_id from messages where (sender_id='${sid}' and reciever_id='${uid}') or (sender_id='${uid}' and reciever_id='${sid}') order by mdate desc limit ${num},20`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            res.json({"messages":result});
        });
    });
}
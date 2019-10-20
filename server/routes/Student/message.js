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
        query=`insert into messages(sender_type,sender_id,reciever_id,mdate) values('S','${uid}','${pgid}','${now}')`;
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
    app.get("/api/student/message",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let num=(req.body.num!=null)?req.body.num*10:0;
        let query=`select PGID,Owner_name,message,id,mdate from messages inner join Owner on messages.sender_id=Owner.PGID and reciever_id='${uid}' order by mdate desc limit ${num},10`;
        db.query(query,(error,result)=>{
            if(error)
            {
              res.statusCode=400;
              console.log(error);
              res.json({"error":"error occured"});
              return;  
            }
            res.statusCode=200;
            res.json(result);
        });
    });
}
module.exports=(app,db,email,sms,auth,datetime)=>{
    app.post("/api/pg/message",auth,(req,res)=>{
        let uid=req.body.uid;
        let pgid=req.decoded["uid"];
        let message=req.body.message;
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        if(!uid || !message)
        {
            res.statusCode=400;
            res.json({"error":"uid and message required"});
            return;
        }
        query=`insert into messages(sender_type,sender_id,reciever_id,mdate) values('P','${pgid}','${uid}','${now}')`;
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
        let query2=`select Email,Contact_number from Student where UID='${uid}'`;
            db.query(query2,(e,r)=>{
                if(e)
                {
                    return;
                }
                let email_id=r[0]["Email"];
                email(email_id,"Message","Hey,there is a new message for you");
        });
    });
    app.delete("/api/pg/message",auth,(req,res)=>{
        let mid=req.body.mid;
        let uid=req.decoded["uid"];
        let query=`delete from messages where sender_id='${uid}' and id='${mid}'`;
        if(!mid)
        {
            res.statusCode=400;
            res.json({"error":"mid required"});
            return;    
        }
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
    app.get("/api/pg/message",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let num=(req.body.num!=null)?req.body.num*10:0;
        let query=`select UID,Name,message,id,mdate from messages inner join Student on messages.sender_id=Student.UID and reciever_id='${pgid}' order by mdate desc limit ${num},10`;
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
module.exports=(app,db,email,sms,auth,datetime)=>{
    app.post("/api/student/review",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let review=req.body.review;
        let rating=req.body.rating;
        let uid=req.decoded["uid"];
        if(!pgid || !review || !rating)
        {
            res.statusCode=400;
            res.json({"error":"pgid,review,rating required"});
            return;
        }
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        let query=`insert into reviews(UID,PGID,review,rating,rdate) values('${uid}','${pgid}','${review}','${rating}','${now}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                console.log(error);
                return;
            }
            res.statusCode=200;
            res.json({"message":"success"});
        });
        let query2=`select Email,Contact from Owner where PGID='${pgid}'`;
            db.query(query2,(e,r)=>{
                if(e)
                {
                    console.log(e);
                    return;
                }
                let email_id=r[0]["Email"];
                email(email_id,"Review","Hey,there is a new review to your pg");
        });
    });
    app.put("/api/student/review",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let review=req.body.review;
        let rating=req.body.rating;
        let uid=req.decoded["uid"];
        if(!pgid || !review || !rating)
        {
            res.statusCode=400;
            res.json({"error":"pgid,review,rating required"});
            return;
        }
        let d=datetime.create();
        let now=d.format('Y-m-d H:M:S');
        let query=`update reviews set review='${review}',rating='${rating}',rdate='${now}' where UID='${uid}' and PGID='${pgid}'`;
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
    })
    app.delete("/api/student/review",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let uid=req.decoded["uid"];
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        query=`delete from reviews where UID='${uid}' and PGID='${pgid}'`;
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
    app.put("/api/student/reviews",auth,(req,res)=>{
        let pgid=req.body.pgid;
        let num=(req.body.num!=null)?req.body.num*10:0;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        query=`select Student.UID,Name,review,rating,rdate from reviews inner join Student on PGID='${pgid}' and reviews.UID=Student.UID order by rdate desc limit ${num},20`;
        db.query(query,(error,result)=>{
            if(error)
            {
                console.log(error);
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            res.json(result);
        });
    });
    app.put("/api/student/my_review",auth,(req,res)=>{
        let uid=req.decoded["uid"];
        let pgid=req.body.pgid;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        query=`select Name,review,rating,rdate from reviews inner join Student on PGID='${pgid}' and reviews.UID='${uid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                console.log(error);
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            res.json(result);
        });
    });
}
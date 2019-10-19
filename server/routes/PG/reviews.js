module.exports=(app,db,email,sms,auth)=>{
    app.get("/api/pg/reviews",auth,(req,res)=>{
        let pgid=req.decoded["uid"];
        let num=(req.body.num!=null)?req.body.num*10:0;
        query=`select Student.UID,Name,review,rating,rdate from reviews inner join Student on PGID='${pgid}' and reviews.UID=Student.UID order by rdate desc limit ${num},10`;
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
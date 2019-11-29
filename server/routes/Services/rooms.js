module.exports=(app,db,auth)=>{
    app.put("/api/student/rooms",auth,(req,res)=>{
        let pgid=req.body.pgid;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        let query=`select PGID,Empty1,Type1,Price from Room where PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occered"});
                console.log(error)
                return;
            }
            res.statusCode=200;
            res.json({"rooms":result});
        });
    });
}
module.exports=(app,db,auth)=>{
    app.get("/api/student/top_rated",auth,(req,res)=>{
        let num=(req.body.num!=null)?req.body.num*10:0;
        let query=`select * from top_rated limit ${num},10`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"an error occured"});
                return;
            }
            res.statusCode=200;
            res.json({"top_rated":result});
        });
    });
}
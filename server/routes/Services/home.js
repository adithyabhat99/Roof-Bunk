module.exports=(app,db,auth)=>{
    app.get("/api/home",auth,(req,res)=>{
        let lat=req.body.lat;
        let lan=req.body.lan;
        let dis=(req.body.dis!=null)?req.body.dis:10;
        let num=(req.body.num!=null)?req.body.num*10:0;
        if(lat==null || lan==null)
        {
            res.statusCode=400;
            res.json({"error":"lat and lan required"});
            return;
        }
        //send proper data when building front end.
        query=`select Pg_name,(6371*acos (
            cos ( radians(${lat}) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(${lan}) )
            + sin ( radians(${lat}) )
            * sin( radians( lat ) ))) as distance
            from Owner having distance<${dis} order by distance limit ${num},10`;
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
}
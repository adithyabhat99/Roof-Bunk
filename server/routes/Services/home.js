module.exports=(app,db,auth)=>{
    app.get("/api/home",auth,(req,res)=>{
        let lat=req.body.lat;
        let lng=req.body.lng;
        let dis=(req.body.dis!=null)?req.body.dis:10;
        let num=(req.body.num!=null)?req.body.num*10:0;
        if(lat==null || lng==null)
        {
            res.statusCode=400;
            res.json({"error":"lat and lan required"});
            return;
        }
        query=`call fetch_pgs(${lat},${lng},${num},${dis})`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error eccured"});
            }
            res.statusCode=200;
            res.json(result[0]); 
        });
    });
}
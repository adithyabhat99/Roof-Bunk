module.exports=(app,db,auth)=>{
    app.post("/api/student/home",auth,(req,res)=>{
        let lat=req.body.lat;
        let lng=req.body.lng;
        let gender=req.body.gender;
        let dis=(req.body.dis!=null)?req.body.dis:200;
        let num=(req.body.num!=null)?req.body.num*10:0;
        if(lat==null || lng==null || gender==null)
        {
            res.statusCode=400;
            res.json({"error":"lat,lng,gender required"});
            return;
        }
        let query=`call fetch_pgs(${lat},${lng},${num},${dis},'${gender}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error eccured"});
            }
            console.log(result)
            res.statusCode=200;
            res.json(result[0]); 
        });
    });
}
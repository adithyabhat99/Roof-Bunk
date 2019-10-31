module.exports=(app,db,auth)=>{
    app.get("/api/student/search",auth,(req,res)=>{
        let lat=req.body.lat;
        let lng=req.body.lng;
        let num=(req.body.num!=null)?req.body.num*10:0;
        let distance=req.body.distance;
        let gender=req.body.gender;
        if(!lat || !lng || !distance || !gender)
        {
            res.statusCode=400;
            res.json({"error":"send lat,lng,gender,distance"});
            return;
        }
        let query=`call fetch_pgs(${lat},${lng},${num},${distance},'${gender}')`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"an error occerd"});
                return;
            }
            res.statusCode=200;
            res.json({"pg_list":result[0]});
        });
    });
}
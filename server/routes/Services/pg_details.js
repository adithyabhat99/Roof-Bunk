module.exports=(app,db,auth)=>{
    app.put("/api/student/pg_details",auth,(req,res)=>{
        let pgid=req.body.pgid;
        if(!pgid)
        {
            res.statusCode=400;
            res.json({"error":"pgid required"});
            return;
        }
        query=`select Pg_name,Owner_name,Contact,Email,Description,lat,lng,Gender,Bathroom,Wifi,AC,Meals,Laundry,Maid,students_preffered,avg(rating) as avg_rating from Owner inner join reviews on Owner.PGID=reviews.PGID and Owner.PGID='${pgid}'`;
        db.query(query,(error,result)=>{
            if(error)
            {
                res.statusCode=400;
                res.json({"error":"error occured"});
                return;
            }
            res.statusCode=200;
            res.json(result);
        });
    });
}
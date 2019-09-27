module.exports=(app)=>{
    // Basic route.
    app.get('/',(req,res)=>{
        res.json({"message":"Hey,this is Roof and Bunk!"});
    });
}
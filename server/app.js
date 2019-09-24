const express=require('express')
const app=express()
const port=6000

app.get('/',(req,res)=>{
    res.json({"message":"Hey,this is Roof and Bunk!"});
})

app.listen(port,()=>{
    console.log("Server started!");
})
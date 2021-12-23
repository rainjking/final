const express = require("express")
const app= express()
const ejs= require('ejs')
const mongoose = require('mongoose') 
mongoose.connect('mongodb://172.21.2.236:27017/190110910810');
const schema={
    name:String,
    age:Number,
    health:String,
    health:String
}
const mydata= mongoose.model('cats1', schema);
// const kitty =new mydata({name:'testZlidjian2'});
// kitty.save()

app.use('/',express.static('public'))
app.get("/input",(req,res)=>{
    res.send(req.query)
    console.log(req.query)
    const kitty =new mydata({name:req.query.first,health:req.query.second});
    kitty.save()
    ejs.renderFile("result.html",{returnVal:"success"},(err,str)=>{
        res.send(str)
    })
})
app.listen(10810)
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")
const express=require("express");
const app=express();


//for user routes
const user_route = require('./routes/userroute');
app.use('/',user_route);

// for admin routes
const adminroute=require('./routes/adminroute');
app.use('/admin',adminroute);

  

app.listen(3000,function(){
console.log("server is  running 3000");
})

//serverside  
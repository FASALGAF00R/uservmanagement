const express =require("express");
const adminroute=express();

const session=require("express-session");
const config =require("../config/config");

const auth = require("../middleware/auth")

adminroute.use(session({secret:config.sessionSecret}));

const bodyParser =require("body-parser");
adminroute.use(bodyParser.json());
adminroute.use(bodyParser.urlencoded({extended:true}));


adminroute.set("view engine",'ejs');
adminroute.set('views','./views/admin');

const admincontroller =require("../controllers/admincontroller");


adminroute.get('/', admincontroller.loginLoad)
adminroute.post('/',admincontroller.verifyLogin);
adminroute.get('/home',admincontroller.loadDashboard);
adminroute.get('/logout',admincontroller.logout);

//for dashboard
adminroute.get('/dashboard',auth.isLogin,admincontroller.admindashboard);

// add new user
adminroute.get('/new-user',auth.isLogin,admincontroller.newUserload);
adminroute.post('/new-user',auth.isLogin,admincontroller.addUser);
//for update user
adminroute.get('/edit-user',auth.isLogin,admincontroller.edituserload);
adminroute.post('/edit-user',auth.isLogin,admincontroller.updateusers);
//for delete
adminroute.get('/delete-user',admincontroller.deleteuser);

adminroute.get('*',(req,res)=>{
    res.redirect('/admin');
})

module.exports=adminroute;
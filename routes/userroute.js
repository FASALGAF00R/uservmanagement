const usercontroller =require("../controllers/usercontroller");
const express= require("express");
const user_route =express();
const bodyParser = require('body-parser')
const session =require("express-session");
const config=require('../config/config')
const auth=require("../middleware/auth");

user_route.use(session({secret:config.sessionSecret}));

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(express.static('public'))


user_route.set('view engine','ejs');
user_route.set('views','./views/users');


user_route.get('/register',auth.isLogout,usercontroller.loadregister);
user_route.post('/register',usercontroller.insertuser);
// userRoute.get("/verify", userController.verifymail); 

user_route.get('/',auth.isLogout,usercontroller.loginLoad);
user_route.get('/login',auth.isLogout,usercontroller.loginLoad);
user_route.post('/login', usercontroller.verifylogin);
user_route.get('/home',auth.isLogin,usercontroller.Loadhome);   
user_route.get('/logout',auth.isLogin,usercontroller.userLogout);
user_route.get('/edit',auth.isLogin,usercontroller.editload);
user_route.post('/edit',auth.isLogin,usercontroller.updateProfile);
module.exports=user_route;
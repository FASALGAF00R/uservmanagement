// const usermodel = require("../models/usermodel");
const user =require("../models/usermodel");
const bcrypt =require('bcrypt');

const loginLoad =async(req,res)=>{
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin =async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
       const userData=await user.findOne({email:email});
console.log(userData);
       if(userData){
       const passwordMatch = await bcrypt.compare(password,userData.password);
       const is_admin = userData.is_admin;
       console.log(is_admin,"jjjj");
       if(passwordMatch){
        if(is_admin === 0){
            res.render('login',{message:"email and password is incorrect"})
        }else{
            console.log("hi");
            req.session.user_id =userData._id;
            res.redirect('/admin/home');
        }

       }else{
        res.render('login',{message:"email and password is incorrect"})
       }
       }else{
        res.render('login',{message:"email and password is incorrect"})
       }
    }catch(error){
        console.log(error.message);
    }
}

const loadDashboard =async(req,res)=>{
    try{
       const userData= await user.findById({_id:req.session.user_id});
res.render('home',{admin:userData});
    }catch(error){
        console.log(error.message);
    }
}
const logout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }catch(error){
        console.log(error.message);
    }
}

const admindashboard =async(req,res)=>{
    try{
        let search ='';
        if(req.query.Search){
            search = req.query.Search;
            console.log(search ,'hrhbkws');
        }
        const regex = new RegExp(search, "i");
       const usersData = await user.find(
        {is_admin: 0,
         $or:[
            { name: { $regex:regex} },
            { email: { $regex:regex } },
            { mobile: { $regex:regex} },

         ],
        });
        res.render('dashboard',{users:usersData});
    }catch(error){
        console.log(error.message);
    }
}
// add new user
const newUserload = async(req,res)=>{
    try{
        res.render('new-user')

    }catch(error){
        console.log(error.message);
    }
}
const addUser =async(req,res)=>{
    try{
const name =req.body.name;
const email =req.body.email;
const mno =req.body.mno;
const password = req.body.password;
const sPassword = await bcrypt.hash(password, 10);
const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      res.render("new-user", { message: "Email already registered" });
    } else {
const newUser =new user({
    name:name,
    email:email,
    mobile:mno,
    password:sPassword,
    is_admin: 0

});

const userData = await newUser.save();

if(userData){

    res.redirect('/admin/dashboard')

}else{
    res.render("new-user",{message:"something wrong"})
}
    }
    }catch(error){
        console.log(error.message);
    }
}

//edit user 
const edituserload = async(req,res)=>{
    try{
const id =req.query.id;
const userData =await user.findById({_id:id});
if(userData){
    res.render('edit-user',{user:userData});

}else{
    res.redirect('/admin/dashboard');
}
    }catch(error){
        console.log(error.message);
    }
}
// update users
const updateusers =async(req,res)=>{
    try{
const userData= await user.findByIdAndUpdate({_id: req.body.id},
    {
        $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            is_verified:req.body.verify,
          },
});
res.redirect('/admin/dashboard');

    }catch(error){
        console.log(error.message);
    }
}

//delete user
const deleteuser =async(req,res)=>{
try{
const id =req.query.id;
await user.deleteOne({_id:id});
res.redirect('/admin/dashboard');
}catch(error){
    console.log(error.message);
}
}
module.exports={
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout,
    admindashboard,
    newUserload   ,
    addUser,
    edituserload,
    updateusers,
    deleteuser
}
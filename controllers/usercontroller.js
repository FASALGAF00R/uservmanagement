
const bcrypt = require('bcrypt');
const User = require('../models/usermodel');
const loadregister = async (req, res) => {
    try {
        res.render('registration');

    } catch (error) {
        console.log(error.message);
    }
};

const insertuser = async (req, res) => {
    try {
        const spassword = await bcrypt.hash(req.body.password, 10);
        // console.log('password  :' , spassword);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            is_admin: 0,
        });
        const userData = await user.save();

        if (userData) {
            res.render('registration', { message: "your registration has been succesfull, Go back to login." });
        } else {
            res.render('registration', { message: "your registration has been failed" });
        }

    } catch (error) {
        console.log(error.message);
    }
};
//login user methods started

const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
};

//verification for login
const verifylogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        console.log(userData, "kkkkkkk");
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            console.log(passwordMatch, "kk");
            if (passwordMatch) {

                if (userData.is_verified === 0) {
                    res.render('home', { user:userData});
                } else {
                    req.session.user_id = userData._id;
                    console.log(req.session.user_id);
                    res.redirect('/login');
                    console.log('fghj');
                }

            } else {
                res.render('login', { message: " not found" });
            }
        }
        else {
            res.render('login', { message: "email and password is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}
const Loadhome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('home', { user: userData });
    } catch (error) {
        console.log(error.message);

    }
}
const userLogout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//user edit controlling

const editload = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('edit', { user: userData });
        } else {
            res.redirect('/home');
        }

    } catch (error) {
        console.log(error.message);
    }
};
//update controlling

const updateProfile = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({ _id: req.body.userId },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno,
                },
            });
        res.redirect('/home');
    } catch (error) {
        console.log(error.message);
    }
};
module.exports = {
    loadregister,
    insertuser,
    loginLoad,
    verifylogin,
    Loadhome,
    userLogout,
    editload,
    updateProfile


};
const passport = require("passport")
const User = require("../models/user.js")

module.exports.signupForm = function (req, res) {
    res.render("users/signup.ejs")
}

module.exports.signup = async function (req, res) {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email,
            username
        })
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to Wanderlust!")
            res.redirect("/listings")    
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.loginForm = function (req, res) {
    res.render("users/login.ejs")
}

module.exports.login = [
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async function (req, res) {
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings"; 
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);
    }
];


module.exports.logout = function(req,res,next){
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings")
    })
}
const express = require("express")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router()
const User = require("../models/user.js")
const { route } = require("./review")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")


//signup
router.get("/signup", function (req, res) {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async function (req, res) {
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
}))

router.get("/login", function (req, res) {
    res.render("users/login.ejs")
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), async function (req, res) {
    req.flash("success", "Welcome back to Wandurlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // 
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
});


router.get("/logout",function(req,res,next){
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings")
    })
})

module.exports = router;
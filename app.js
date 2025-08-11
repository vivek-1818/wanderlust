if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const ejsMate = require("ejs-mate")
const app = express();
const methodOverride = require("method-override")
const MONGO_URL = process.env.MONGO_URL;
// const ExpressError = require("../utils/ExpressError.js") 
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const { router: listingRouter } = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const sessionOptons = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))
app.use(session(sessionOptons))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

main().then(()=>{
    console.log("Connection successful with DB")
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


app.use(function(req,res,next){
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})

app.get("/demouser",async function(req,res){
    let fakeuser = new User({
        email: "vivo@gmail.com",
        username: "test"
    })

    let registeruser = await User.register(fakeuser, "passtest")
    res.send(registeruser)
})

app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)


app.get("/",function(req,res){
    res.send("This is root")
})

// app.all("*", function(req,res,next){
//     next(new ExpressError(404, "Page not Found!"))
// })

app.use(function(err, req, res, next){
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080);
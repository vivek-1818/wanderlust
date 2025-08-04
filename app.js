const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const ejsMate = require("ejs-mate")
const app = express();
const methodOverride = require("method-override")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const ExpressError = require("../utils/ExpressError.js") 
const session = require("express-session")
const flash = require("connect-flash")

const { router: listing } = require("./routes/listing.js");
const reviews = require("./routes/review.js")

const sessionOptons = {
    secret: "mysecret",
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
    next()
})

app.use("/listings", listing); 
app.use("/listings/:id/reviews", reviews)




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
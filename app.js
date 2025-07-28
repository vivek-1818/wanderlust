const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const ejsMate = require("ejs-mate")
const app = express();
const methodOverride = require("method-override")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const ExpressError = require("../utils/ExpressError.js") 


const { router: listing } = require("./routes/listing.js");
const reviews = require("./routes/review.js")


app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

main().then(()=>{
    console.log("Connection successful with DB")
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


app.use("/listings", listing); 
app.use("/listings/:id/reviews", reviews)



app.get("/",function(req,res){
    res.send("This is root")
})

// app.all("*", function(req,res,next){
//     next(new ExpressError(404, "Page not Found!"))
// })

app.use(function(err, req, res, next){
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message)
})

app.listen(8080);
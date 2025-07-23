const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")
const ejsMate = require("ejs-mate")
const app = express();
const methodOverride = require("method-override")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

app.get("/",function(req,res){
    res.send("This is root")
})

//Edit route
app.get("/listings/:id/edit", async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

//update route
app.put("/listings/:id",async function(req,res){
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listings})
    res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id",async function(req,res){
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/listings")
})

// app.get("/testListing",async function(req,res){
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Latur",
//         country:"India"
//     })

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("Testing complete")
// })

//index route
app.get("/listings",async function(req,res){
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing})
})

//new listing route
app.get("/listings/new",function(req,res){
    res.render("listings/new.ejs")
})

//create route
// app.post("/listings",async function(req,res){
//     // let{title,description,image,price,location,country} = req.body;
//     let listing = req.body.listings;
//     const newListing = new Listing(listing);
//     await newListing.save();
//     res.redirect("/listings")
//     console.log(listing)
// })

app.post("/listings", async function (req, res) {
    let listing = req.body.listings;

    // Fix the image structure manually
    const imageUrl = listing.image;
    listing.image = {
        url: imageUrl,
        filename: "listingimage"  // or extract from URL if needed
    };

    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
});


//show route
app.get("/listings/:id",async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs",{listing})
    // console.log(listing);
})


app.listen(8080);
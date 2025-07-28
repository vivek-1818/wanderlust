const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema, reviewsSchema} = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")


function validateListing (req,res,next){
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error)
        throw new ExpressError(400, error)
    }else{
        next()
    }
}


//index route
router.get("/",wrapAsync(async function(req,res){
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing})
}))

//new listing route
router.get("/new",function(req,res){
    res.render("listings/new.ejs")
})

//show route
router.get("/:id",wrapAsync(async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs",{listing})
    // console.log(listing);
}))

//create
router.post("/", validateListing, wrapAsync(async function (req, res, next) {
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
}));

//Edit route
router.get("/:id/edit", wrapAsync(async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))

router.put("/:id", validateListing, wrapAsync(async function (req, res) {
    let { id } = req.params;
    let listing = req.body.listings;

    const imageUrl = listing.image?.url || listing.image;
    listing.image = {
        url: imageUrl,
        filename: "listingimage"
    };

    const updatedListing = await Listing.findByIdAndUpdate(id, listing, { runValidators: true, new: true });
    res.redirect(`/listings/${id}`);
}))


//delete route
router.delete("/:id", wrapAsync(async function(req,res){
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/listings")
}))

module.exports = {
    router,
    validateListing
};

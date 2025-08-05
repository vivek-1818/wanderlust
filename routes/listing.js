const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema, reviewsSchema} = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const { isLoggedIn } = require("../middleware.js")


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
router.get("/new",isLoggedIn, function(req,res){
    res.render("listings/new.ejs")
})

//show route
router.get("/:id",wrapAsync(async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        req.flash("error", "Listing  you  requested  for  does  not  exist")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
    // console.log(listing);
}))

//create
router.post("/", validateListing, isLoggedIn, wrapAsync(async function (req, res, next) {
    let listing = req.body.listings;

    // Fix the image structure manually
    const imageUrl = listing.image;
    listing.image = {
        url: imageUrl,
        filename: "listingimage"  // or extract from URL if needed
    };
    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing  you  requested  for  does  not  exist")
        return res.redirect("/listings")
    }
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
    req.flash("success", "Listing Edited!")
    res.redirect(`/listings/${id}`);
}))


//delete route
router.delete("/:id",isLoggedIn, wrapAsync(async function(req,res){
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}))

module.exports = {
    router,
    validateListing
};

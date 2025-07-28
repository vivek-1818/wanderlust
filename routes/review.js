const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewsSchema} = require("../schema.js")
const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js")

function validateReview (req,res,next){
    let {error} = reviewsSchema.validate(req.body);
    if(error){
        console.log(error)
        throw new ExpressError(400, error)
    }else{
        next()
    }
}

//reviews 
//Post route
router.post("/",validateReview, wrapAsync(async function(req,res){
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()

    res.redirect(`/listings/${listing._id}`)
}))

//delete review route
router.delete("/:reviewId",wrapAsync(async function(req,res){
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))

module.exports = router;
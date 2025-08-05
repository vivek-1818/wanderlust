const Listing = require("./models/listing")
const Review = require("./models/reviews")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewsSchema} = require("./schema.js")

module.exports.isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be Logged In")
        return res.redirect("/login")
    }
    next()
} 


module.exports.saveRedirectUrl = function(req,res,next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


module.exports.isOwner = async function(req,res,next){
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id) ){
        req.flash("error", "You are not owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validateListing = function  (req,res,next){
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error)
        throw new ExpressError(400, error)
    }else{
        next()
    }
}


module.exports.validateReview = function  (req,res,next){
    let {error} = reviewsSchema.validate(req.body);
    if(error){
        console.log(error)
        throw new ExpressError(400, error)
    }else{
        next()
    }
}


module.exports.isReviewAuthor = async function(req, res, next) {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (String(review.author) !== String(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

const Listing = require("../models/listing")

module.exports.index = async function(req,res){
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing})
}

module.exports.renderNewForm = function(req,res){
    res.render("listings/new.ejs")
}

module.exports.showListing = (async function(req, res) {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
})

module.exports.createListing = async function (req, res, next) {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listings;

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async function(req,res){
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing  you  requested  for  does  not  exist")
        return res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs",{listing, originalImageUrl})
}

module.exports.updateListing = async function (req, res) {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
        id, 
        req.body.listing, 
        { runValidators: true, new: true }
    );

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async function(req,res){
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}
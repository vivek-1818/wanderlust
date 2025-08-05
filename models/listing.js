const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews"); 

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "default_image"
        },
        url: {
            type: String,
            default: "https://images.pexels.com/photos/9080953/pexels-photo-9080953.jpeg"
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async function(listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); 
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

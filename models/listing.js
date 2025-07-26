const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
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
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

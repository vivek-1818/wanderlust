const Joi = require("joi");
const reviews = require("./models/reviews");
// const joi = require("joi");

module.exports.listingSchema = Joi.object({
    listings : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.allow("", null)
    }).required()
})

module.exports.reviewsSchema = Joi.object({
    reviews : Joi.object({
        commnet: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})
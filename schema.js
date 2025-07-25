const Joi = require("joi");
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
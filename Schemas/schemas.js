const BasicJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const Joi = BasicJoi.extend((joi)=>{
   return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{$label}} must not contain any HTML!',
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const clean = sanitizeHTML(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if (clean !== value) return helpers.error("string.escapeHTML", {value});
                    return clean;
                }
            }
        }
   }
});

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        images: Joi.array().items(Joi.object({
            url: Joi.string().required().escapeHTML(),
            filename: Joi.string().required(),
        })),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    imagesToDelete: Joi.array().items(
        Joi.number(),
    ),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHTML(),        
    }).required(),
});

module.exports = {
    campgroundSchema,
    reviewSchema,
};
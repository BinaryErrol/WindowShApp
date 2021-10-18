const express = require('express');
const router = express.Router({mergeParams: true});

const Windowshop = require('../models/windowshop');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    const review = new Review(req.body.review);
    windowshop.reviews.push(review);
    await review.save();
    await windowshop.save();
    req.flash('success', 'Posted a new review!');
    res.redirect(`/windowshops/${windowshop._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req,res) => {
    const {id, reviewId} = req.params;
    await Windowshop.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'You have deleted your review!');
    res.redirect(`/windowshops/${id}`);
}))

module.exports = router;
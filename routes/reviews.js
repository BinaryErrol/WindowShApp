const express = require('express');
const router = express.Router({mergeParams: true});

const Windowshop = require('../models/windowshop');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.post('/',isLoggedIn, validateReview, catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    windowshop.reviews.push(review);
    await review.save();
    await windowshop.save();
    req.flash('success', 'Posted a new review!');
    res.redirect(`/windowshops/${windowshop._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req,res) => {
    const {id, reviewId} = req.params;
    await Windowshop.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'You have deleted your review!');
    res.redirect(`/windowshops/${id}`);
}))

module.exports = router;
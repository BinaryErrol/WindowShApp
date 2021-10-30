const express = require('express');
const router = express.Router({mergeParams: true});

const Windowshop = require('../models/windowshop');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
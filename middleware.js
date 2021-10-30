const { windowshopSchema, reviewSchema, productSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Windowshop = require('./models/windowshop');
const Review = require('./models/review');
const Product = require('./models/product');

module.exports.isLoggedIn = (req,res, next) => {
    if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
}
next();
}

 module.exports.validateWindowshop = (req, res, next) => {
    const { error } = windowshopSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const windowshop = await Windowshop.findById(id);
    if (!windowshop.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/windowshops/${id}`);

    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateProduct = (req,res,next) => {
    const {error} = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateComment = (req,res,next) => {
    const {error} = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/windowshops/${id}`);

    }
    next();
}

module.exports.isProductAuthor = async(req,res,next) => {
    const {id, productId} = req.params;
    const product = await Product.findById(productId);
    if (!product.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/windowshops/${id}`);
    }
}
const express = require('express');
const router = express.Router({mergeParams: true});

const Windowshop = require('../models/windowshop');
const Product = require('../models/product');
const Comment = require('../models/comment');

const { validateComment, isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateComment, catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    const product = await Product.findById(req.params.productId);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    product.comments.push(comment);
    await comment.save();
    await product.save();
    await windowshop.save();
    req.flash('success', 'Posted a new comment!');
    res.redirect(`/windowshops/${windowshop._id}`);
}));

router.delete('/:commentId', catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    const {productId, commentId} = req.params;
    await Product.findByIdAndUpdate(productId, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success', 'You have deleted your comment!');
    res.redirect(`/windowshops/${windowshop._id}`);
}))

module.exports = router;

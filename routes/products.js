const express = require('express');
const router = express.Router({mergeParams: true});

const Windowshop = require('../models/windowshop');
const Product = require('../models/product');

const { validateProduct, isAuthor, isLoggedIn } = require('../middleware')

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, isAuthor, validateProduct, catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    const product = new Product(req.body.product);
    product.author = req.user._id;
    windowshop.products.push(product);
    await product.save();
    await windowshop.save();
    req.flash('success', 'Posted a new product!');
    res.redirect(`/windowshops/${windowshop._id}`);
}));

router.get('/:id', catchAsync(async(req,res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/windowshops');
    }
    res.redirect(`/windowshops/${id}`);
}))

router.delete('/:productId', catchAsync(async (req,res) => {
    const {id, productId} = req.params;
    await Windowshop.findByIdAndUpdate(id, { $pull: {products: productId}})
    await Product.findByIdAndDelete(req.params.productId);
    req.flash('success', 'You have deleted your product!');
    res.redirect(`/windowshops/${id}`);
}))

module.exports = router;

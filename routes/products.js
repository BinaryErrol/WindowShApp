const express = require('express');
const router = express.Router({mergeParams: true});

const Windowshop = require('../models/windowshop');
const Product = require('../models/product');

const { productSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateProduct = (req,res,next) => {
    const {error} = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateProduct, catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    const product = new Product(req.body.product);
    windowshop.products.push(product);
    await product.save();
    await windowshop.save();
    req.flash('success', 'Posted a new product!');
    res.redirect(`/windowshops/${windowshop._id}`);
}));

router.delete('/:productId', catchAsync(async (req,res) => {
    const {id, productId} = req.params;
    await Windowshop.findByIdAndUpdate(id, { $pull: {products: productId}})
    await Product.findByIdAndDelete(req.params.productId);
    req.flash('success', 'You have deleted your product!');
    res.redirect(`/windowshops/${id}`);
}))

module.exports = router;

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { windowshopSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Windowshop = require('../models/windowshop');

const validateWindowshop = (req, res, next) => {
    const { error } = windowshopSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req,res) => {
    const windowshops = await Windowshop.find({});
    res.render('windowshops/index', {windowshops})
}))

router.get('/new',isLoggedIn, (req,res) => {
    res.render('windowshops/new');
})

router.post('/',isLoggedIn, validateWindowshop, catchAsync(async (req,res, next) => {
    
    const windowshop = new Windowshop(req.body.windowshop);
    await windowshop.save();
    req.flash('success', 'Successfully made a new Windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);   
}))


router.get('/:id', catchAsync(async(req,res) => {
    const windowshop = await Windowshop.findById(req.params.id).populate('reviews').populate({path: 'products', populate: { path: 'comments'}});
    if(!windowshop){
        req.flash('error', 'Cannot find that windowshop!');
        return res.redirect('/windowshops');
    }
    res.render('windowshops/show', {windowshop});
}))

router.get('/:id/edit',isLoggedIn, catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    if(!windowshop){
        req.flash('error', 'Cannot find that windowshop!');
        return res.redirect('/windowshops');
    }
    res.render('windowshops/edit', {windowshop});
}))

router.put('/:id',isLoggedIn, validateWindowshop, catchAsync(async (req,res) => {
    const {id} = req.params
    const windowshop = await Windowshop.findByIdAndUpdate(id, {...req.body.windowshop});
    req.flash('success', 'Successfully updated windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);
}))

router.delete('/:id',isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    await Windowshop.findByIdAndDelete(id);
    req.flash('success', 'You have deleted your windowshop!');
    res.redirect('/windowshops');
}))

module.exports = router;
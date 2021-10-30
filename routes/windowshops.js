const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateWindowshop, isAuthor } = require('../middleware');

const Windowshop = require('../models/windowshop');


router.get('/', catchAsync(campgrounds.index))

router.get('/new',isLoggedIn, (req,res) => {
    res.render('windowshops/new');
})

router.post('/', isLoggedIn, validateWindowshop, catchAsync(async (req,res, next) => {
    const windowshop = new Windowshop(req.body.windowshop);
    windowshop.author = req.user._id;
    await windowshop.save();
    req.flash('success', 'Successfully made a new Windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);   
}))


router.get('/:id', catchAsync(async(req,res) => {
    const windowshop = await Windowshop.findById(req.params.id).populate({
        path: 'reviews', populate: { path: 'author'}}).populate({
            path: 'products', populate: { path: 'comments', path: 'author'}}).populate('author');
    console.log(windowshop);
    if(!windowshop){
        req.flash('error', 'Cannot find that windowshop!');
        return res.redirect('/windowshops');
    }
    res.render('windowshops/show', {windowshop});
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const {id} = req.params;
    const windowshop = await Windowshop.findById(id);
    if(!windowshop){
        req.flash('error', 'Cannot find that windowshop!');
        return res.redirect('/windowshops');
    }
    res.render('windowshops/edit', {windowshop});
}))

router.put('/:id',isLoggedIn, isAuthor, validateWindowshop, catchAsync(async (req,res) => {
    const {id} = req.params;
    const windowshop = await Windowshop.findByIdAndUpdate(id, {...req.body.windowshop});
    req.flash('success', 'Successfully updated windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);
}))

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const {id} = req.params;
    await Windowshop.findByIdAndDelete(id);
    req.flash('success', 'You have deleted your windowshop!');
    res.redirect('/windowshops');
}))

module.exports = router;
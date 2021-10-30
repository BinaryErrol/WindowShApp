const Windowshop = require('../models/windowshop');

module.exports.index = async(req,res) => {
    const windowshops = await Windowshop.find({});
    res.render('windowshops/index', {windowshops})
}

module.exports.renderNewForm = (req,res) => {
    res.render('windowshops/new');
}

module.exports.createWindowshop = async (req,res, next) => {
    const windowshop = new Windowshop(req.body.windowshop);
    windowshop.author = req.user._id;
    await windowshop.save();
    req.flash('success', 'Successfully made a new Windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);   
}

module.exports.showWindowshop = async(req,res) => {
    const windowshop = await Windowshop.findById(req.params.id).populate({
        path: 'reviews', populate: { path: 'author'}}).populate({
            path: 'products', populate: { path: 'comments', path: 'author'}}).populate('author');
    console.log(windowshop);
    if(!windowshop){
        req.flash('error', 'Cannot find that windowshop!');
        return res.redirect('/windowshops');
    }
    res.render('windowshops/show', {windowshop});
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const windowshop = await Windowshop.findById(id);
    if(!windowshop){
        req.flash('error', 'Cannot find that windowshop!');
        return res.redirect('/windowshops');
    }
    res.render('windowshops/edit', {windowshop});
}

module.exports.updateWindowshop = async (req,res) => {
    const {id} = req.params;
    const windowshop = await Windowshop.findByIdAndUpdate(id, {...req.body.windowshop});
    req.flash('success', 'Successfully updated windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);
}

module.exports.deleteWindowshop = async (req,res) => {
    const {id} = req.params;
    await Windowshop.findByIdAndDelete(id);
    req.flash('success', 'You have deleted your windowshop!');
    res.redirect('/windowshops');
}
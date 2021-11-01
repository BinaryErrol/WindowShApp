const Windowshop = require('../models/windowshop');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req,res) => {
    const windowshops = await Windowshop.find({});
    res.render('windowshops/index', {windowshops})
}

module.exports.renderNewForm = (req,res) => {
    res.render('windowshops/new');
}

module.exports.createWindowshop = async (req,res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.windowshop.location,
        limit: 1
    }).send()
    const windowshop = new Windowshop(req.body.windowshop);
    windowshop.geometry = geoData.body.features[0].geometry;
    windowshop.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    windowshop.author = req.user._id;
    await windowshop.save();
    console.log(windowshop);
    req.flash('success', 'Successfully made a new Windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);  
}

module.exports.showWindowshop = async(req,res) => {
    const windowshop = await Windowshop.findById(req.params.id).populate({
        path: 'reviews', populate: { path: 'author'}}).populate({
            path: 'products', populate: { path: 'comments'}}).populate('author');
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
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    windowshop.images.push(...imgs);
    await windowshop.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await windowshop.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated windowshop!');
    res.redirect(`/windowshops/${windowshop._id}`);
}

module.exports.deleteWindowshop = async (req,res) => {
    const {id} = req.params;
    await Windowshop.findByIdAndDelete(id);
    req.flash('success', 'You have deleted your windowshop!');
    res.redirect('/windowshops');
}
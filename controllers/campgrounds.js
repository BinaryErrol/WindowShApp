const Windowshop = require('../models/windowshop');

module.exports.index = async(req,res) => {
    const windowshops = await Windowshop.find({});
    res.render('windowshops/index', {windowshops})
}

module.exports.renderNewForm = (req,res) => {
    res.render('windowshops/new');
}
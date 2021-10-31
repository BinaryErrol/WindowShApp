const express = require('express');
const router = express.Router();
const windowshops = require('../controllers/windowshops');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateWindowshop, isAuthor } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const Windowshop = require('../models/windowshop');

router.route('/')
    .get(catchAsync(windowshops.index))
    .post(isLoggedIn, upload.array('image'), validateWindowshop, catchAsync(windowshops.createWindowshop));

router.get('/new',isLoggedIn, windowshops.renderNewForm)

router.route('/:id')
    .get( catchAsync(windowshops.showWindowshop))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateWindowshop, catchAsync(windowshops.updateWindowshop))
    .delete(isLoggedIn, isAuthor, catchAsync(windowshops.deleteWindowshop));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(windowshops.renderEditForm))

module.exports = router;
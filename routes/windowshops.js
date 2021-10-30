const express = require('express');
const router = express.Router();
const windowshops = require('../controllers/windowshops');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateWindowshop, isAuthor } = require('../middleware');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

const Windowshop = require('../models/windowshop');

router.route('/')
    .get(catchAsync(windowshops.index))
    .post(isLoggedIn, validateWindowshop, catchAsync(windowshops.createWindowshop));

router.get('/new',isLoggedIn, windowshops.renderNewForm)

router.route('/:id')
    .get( catchAsync(windowshops.showWindowshop))
    .put(isLoggedIn, isAuthor, validateWindowshop, catchAsync(windowshops.updateWindowshop))
    .delete(isLoggedIn, isAuthor, catchAsync(windowshops.deleteWindowshop));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(windowshops.renderEditForm))

module.exports = router;
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Windowshop = require('./models/windowshop');

mongoose.connect('mongodb://localhost:27017/window-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateWindowshop = (req, res, next) => {
    const { error } = windowshopSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req,res) => {
    res.render('home')
})
app.get('/windowshops', catchAsync(async(req,res) => {
    const windowshops = await Windowshop.find({});
    res.render('windowshops/index', {windowshops})
}))

app.get('/windowshops/new', (req,res) => {
    res.render('windowshops/new');
})

app.post('/windowshops', validateWindowshop, catchAsync(async (req,res, next) => {
        const windowshop = new Windowshop(req.body.windowshop);
    await windowshop.save();
    res.redirect(`/windowshops/${windowshop._id}`);   
}))


app.get('/windowshops/:id', catchAsync(async(req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    res.render('windowshops/show', {windowshop});
}))

app.get('/windowshops/:id/edit', catchAsync(async (req,res) => {
    const windowshop = await Windowshop.findById(req.params.id);
    res.render('windowshops/edit', {windowshop});
}))

app.put('/windowshops/:id', validateWindowshop, catchAsync(async (req,res) => {
    const {id} = req.params
    const windowshop = await Windowshop.findByIdAndUpdate(id, {...req.body.windowshop});
    res.redirect(`/windowshops/${windowshop._id}`);
}))

app.delete('/windowshops/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    await Windowshop.findByIdAndDelete(id);
    res.redirect('/windowshops');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', {err})
})

app.listen(3000,()=> {
    console.log('Serving on port 3000')
})
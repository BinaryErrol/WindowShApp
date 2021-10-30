const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Windowshop = require('../models/windowshop');

mongoose.connect('mongodb://localhost:27017/window-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Windowshop.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *20) + 10;
        const shop = new Windowshop({
            author: '617c727a106123d4881cae5a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/9074009',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum dicta similique magnam. Quas recusandae nihil, nulla cupiditate eaque ea, aut magnam earum reprehenderit ab reiciendis sint? Sed est consectetur repellat?',
            price
        })
        await shop.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
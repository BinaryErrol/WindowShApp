const mongoose = require('mongoose');
const Review = require('./review');
const Product = require('./product');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    
    url: String,
    filename: String
    
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})


const WindowshopSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

WindowshopSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }

    if (doc)  {
        await Product.deleteMany({
            _id: {
                $in: doc.products
            }
        })
    }
})

module.exports = mongoose.model('Windowshop', WindowshopSchema);
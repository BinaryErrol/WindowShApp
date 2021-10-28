const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
});

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Product', productSchema);
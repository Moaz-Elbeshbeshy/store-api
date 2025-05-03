const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'provide a product name']
    },
    price: {
        type: Number,
        required: [true, 'provide a product price']
    },
    company: {
        type: String,
        required: true,
        enum: {
            values: ['ikea', 'marcos', 'liddy', 'caressa'],
            message: '{VALUE} is not supported'
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.2
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Product', productSchema)
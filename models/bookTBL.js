const mongoose = require('mongoose')

const bookTBL = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publishedDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        require:true
    },
    image:{
        type:String,
        require:true
    }
})

let Book = mongoose.model('books', bookTBL)
module.exports = Book
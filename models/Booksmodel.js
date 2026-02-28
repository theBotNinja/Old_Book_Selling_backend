const mongoose = require('mongoose');
const { Schema } = mongoose;

const booksmodel = new Schema({
    Name: String,
    description: String,
    price: Number,
    betOn: Boolean,
    image: String,
    minimumBet: Number,
    maximumBet: Number,
    date: { type: Date, default: Date.now },
},
    { timestamps: true });

const Booksmodel = mongoose.model('booksmodel', booksmodel);


module.exports = Booksmodel;

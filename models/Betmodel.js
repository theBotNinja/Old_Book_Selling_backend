const mongoose = require('mongoose');
const { Schema } = mongoose;

const betModel = new Schema({
    User: String,
    BetAmount: Number,
    BookID: String,
    BookName: String,
    status: {
        type: String,
        enum: ["pending", "won"],
        default: "pending"
    },
    date: { type: Date, default: Date.now },
},
    { timestamps: true });

const BetModel = mongoose.model('allBets', betModel);


module.exports = BetModel;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String, unique: true,
        required: true
    },
    mobileNumber: {
        type: String,
        match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"]
    },
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

module.exports = mongoose.model("User", userSchema);
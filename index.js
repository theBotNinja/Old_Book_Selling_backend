const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserRoute = require("./Routes/UserRoute")
const BetRouter = require('./Routes/BetRoute');
const BookRouter = require('./Routes/BookRoute');
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use('/static', express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`API Running .. ${mongoose.connection.readyState}`);
});
app.use('/bet', BetRouter);
app.use('/user', UserRoute);
app.use('/books', BookRouter);

const connectdb = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB", connection);
    app.listen(PORT, async () => {
        console.log(`Server is running on port ${PORT} ${connection}`);
    });
}
connectdb()
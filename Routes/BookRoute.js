const express = require('express')
const router = express.Router()
const Booksmodel = require('../models/Booksmodel')
const { auth, isAdmin } = require("../middleware/authMiddleware")
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "..", "public");
        // Ensure the directory exists (multer won't create it)
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log("Saving to:", uploadPath); // 👈 DEBUG
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    const services = await Booksmodel.find()
    res.send(services)
})
router.get('/:id', async (req, res) => {
    const services = await Booksmodel.findById(req.params.id)
    res.send(services)
})

router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
    const { Name, description, price, minimumBet, maximumBet } = req.body
    const image = req.file ? `/static/${req.file.filename}` : null;
    console.log(req.file)
    if (!Name || !price || !description || !image || !minimumBet || !maximumBet) {
        return res.status(400).send('All fields are required')
    }
    const books = new Booksmodel({
        Name,
        description,
        price,
        betOn: true,
        image,
        minimumBet,
        maximumBet
    })

    await books.save()
    res.send(books)
})

router.put('/update/:id', auth, isAdmin, async (req, res) => {
    const { Name, description, price, betOn, image, minimumBet, maximumBet } = req.body

    if (!Name || !price || !description || !betOn || !image || !minimumBet || !maximumBet) {
        return res.status(400).send('All fields are required')
    }
    const books = await Booksmodel.findByIdAndUpdate(req.params.id, {
        Name,
        description,
        price,
        betOn,
        image,
        minimumBet,
        maximumBet
    })
    await books.save()
    res.send(books)
})

router.delete('/delete/:id', auth, isAdmin, async (req, res) => {
    const books = await Booksmodel.findByIdAndDelete(req.params.id)
    res.send(books)
})

module.exports = router
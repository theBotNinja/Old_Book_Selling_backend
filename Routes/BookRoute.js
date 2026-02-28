const express = require('express')
const router = express.Router()
const Booksmodel = require('../models/Booksmodel')
const { auth, isAdmin } = require("../middleware/authMiddleware")
const streamifier = require("streamifier");
const multer = require("multer");
const cloudinary = require("../config/cloudinary1");
const storage = multer.memoryStorage();

const upload = multer({
    storage
});

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
    let image;
    console.log(req.file)
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "old-books" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        const result = await streamUpload();
        image = result.secure_url;
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: error.message });
    }
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
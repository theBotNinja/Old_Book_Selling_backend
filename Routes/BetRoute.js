const express = require('express')
const router = express.Router()

const BetModel = require('../models/BetModel')
const Booksmodel = require('../models/Booksmodel')
const userSchema = require('../models/UserModel')

const { auth, isAdmin } = require('../middleware/authMiddleware')

router.get('/:BookID', auth, isAdmin, async (req, res) => {
    res.send(await BetModel.find({ BookID: req.params.BookID }).sort({ BetAmount: -1 }))
})
router.get('/user/:UserId', auth, async (req, res) => {
    res.send(await BetModel.find({ User: req.params.UserId }).sort({
        createdAt: -1
    }))
})

router.post('/:UserId/:BookId/:Amount', auth, async (req, res) => {
    const UserRec = await userSchema.findById(req.params.UserId)
    if (!UserRec) return res.status(404).send("User Not Found!")
    const BookRec = await Booksmodel.findById(req.params.BookId)
    if (!BookRec) return res.status(404).send("Book Not Found!")
    if (req.params.Amount > BookRec.maximumBet || req.params.Amount < BookRec.minimumBet) {
        return res.status(400).send("too low or too high bet amount")
    }

    const existCallRequest = await BetModel.find({ User: UserRec._id, BookID: req.params.BookId, BetAmount: req.params.Amount })
    console.log(existCallRequest)
    if (existCallRequest.length > 0) {
        return res.status(400).send('bet already exists')
    }
    const betRequest = new BetModel({
        User: UserRec._id,
        BetAmount: req.params.Amount,
        BookID: BookRec._id,
        BookName: BookRec.Name
    })
    await betRequest.save()
    res.send(betRequest)
    // await BetModel.deleteMany({
    //     _id: {
    //         $in: await BetModel.find()
    //             .sort({ createdAt: -1 })
    //             .skip(500)
    //             .select("_id")
    //     }
    // });
})

module.exports = router
const express = require("express");
const { Account } = require("../db");
const authMiddleware = require("../middleware");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get('/balance',authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance : account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    // ---------------------------- Bad Solution ------------------------------------------

    // This is bad solution why if some 2 concurrent request occurs this will fail this solution for that we have to use transaction method in mongoose


    
    // const {amount , to } = req.body;
    // const account = await Account.findOne({
    //     userId: req.userId
    // })

    // if(account.balance < amount){
    //     return res.status(400).json({
    //         msg: "Insufficient balance"
    //     })
    // }
    // const toAccount = await Account.findOne({
    //     userId: to
    // })

    // if(!toAccount){
    //     return res.status(400).json({
    //         msg: "Invalid Account"
    //     })
    // }

    // // sender money will debit here 

    // await Account.updateOne({
    //     userId: req.userId
    // },{
    //     $inc: {
    //         balance : -amount
    //     }
    // })

    // // getters money will credit here

    // await Account.updateOne({
    //     userId: to
    // },{
    //     $inc: {
    //         balance : amount
    //     }
    // })

    // res.json({
    //     msg: "Transfer successfully"
    // })


    // ---------------------- Good solution -----------------------------------------------
    try {
        const session = await mongoose.startSession();

    session.startTransaction();
    const {amount, to} = req.body;

    const account = await Account.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({
            msg: "Insufficient balance"
        })
    } 

    const toAccount = await Account.findOne({userId: to}).session(session);
    
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({msg:"Invalid Account"})
    }

    await Account.updateOne({userId: req.userId},{$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userId: to}, {$inc:{balance: amount}}).session(session)    

    await session.commitTransaction()

    res.json({
        msg: "Transfer successfully"
    })
    } catch (error) {
        await session.abortTransaction();
        res.json({
            msg: "Something went wrong"
        })
    }
    
})

module.exports = router
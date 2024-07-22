const express = require("express");
const zod = require("zod");
const { User, Account } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware");

const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const updatedBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ msg: "Email already taken / Input Invalid" });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({ msg: "Email already taken / Input Invalid" });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;

  // -------- Create new account with random balance -------
  await Account.create({
    userId : userId,
    balance: 1+ Math.random() * 1000
  })

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    msg: "User create successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      msg: "Input Invalid",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      token: token,
    });
    return;
  }

  res.json({
    msg: "Error while logging in",
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updatedBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ msg: "Invalid Inputs" });
  }

  await User.updateOne({ _id: req.userId }, req.body); // good syntax to digest

  res.json({
    msg: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user : users.map(user => ({
        username : user.username,
        firstName: user.firstName,
        lastName : user.lastName,
        _id: user._id
    }))
  })
});

module.exports = router;

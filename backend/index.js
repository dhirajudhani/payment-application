const express = require("express")

const rootRouter = require("./routes/index")

const app = express();

// basically this middleware will make sure that all routes will start with /api/v1
app.use("/api/v1", rootRouter) 
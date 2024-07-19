const express = require("express")
const cors = require("cors")
const rootRouter = require("./routes/index")

const app = express();

app.use(cors())

app.use(express.json())

// basically this middleware will make sure that all routes will start with /api/v1

app.use("/api/v1", rootRouter) 


app.listen(3000)
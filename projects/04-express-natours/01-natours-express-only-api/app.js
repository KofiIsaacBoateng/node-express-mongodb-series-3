const express = require("express")
const fs = require("fs")
const path = require("path")
// routes
const userRoutes = require("./routes/users")
const tourRoutes = require("./routes/tours")

const app = express()
const PORT = process.env.PORT || 3000



/** middlewares */
app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "public")))

/*** routes */
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/tours", tourRoutes)


module.exports = app
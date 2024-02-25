const path = require("path")
const fs = require("fs")
const users = path.join(__dirname, "..", "dev-data", "data", "users.json") // robust data with a lot more fields


module.exports.getAllUsers = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

module.exports.getUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

module.exports.createUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

module.exports.updateUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

module.exports.deleteUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}
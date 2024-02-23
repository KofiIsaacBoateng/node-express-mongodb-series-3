const http = require("http")

const server = http.createServer((req, res) => {
    res.end("<h1 style=\"text-align: center; margin-top: 30px; color: #555\">SIMPLE SERVER</h1>")
})


server.listen(5000, "localhost", () => {
    console.log("Server is listening on port 5000.")
})
const http = require("http")
const fs = require('fs')


const data = fs.readFileSync(`${__dirname}/data.json`)
const dataObject = JSON.parse(data)

const server = http.createServer((req, res) => {
    const pathName = req.url
    let message
    let statusCode
    let contentType

    switch(pathName){
        case "/":
            message = "See Everything In One View"
            contentType="text/html"
            statusCode = 200
            break;

        case "/overview":
            message = "See Everything In One View"
            contentType="text/html"
            statusCode = 200
            break;

        case "/products":
            message = "What would you want to buy? :)"
            contentType="text/html"
            statusCode = 200
            break;

        case "/api":
            statusCode = 200
            contentType = "application/json"
            console.log(dataObject)
        default:
            message = "Oops Page Not Found!"
            statusCode = 404;
            break    
    }
    res.writeHead(statusCode, {
        "Content-type": contentType
    })

    pathName === "/api" ? 
        res.end(data) :
        res.end(`<h1 style="text-align: center; margin-top: 30px; color: #555; text-transform: uppercase;">${message}</h1>`)
})


server.listen(5000, "localhost", () => {
    console.log("Server is listening on port 5000.")
})
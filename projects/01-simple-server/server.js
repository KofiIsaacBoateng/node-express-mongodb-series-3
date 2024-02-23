const http = require("http")

const server = http.createServer((req, res) => {
    const pathName = req.url
    let message
    let statusCode

    switch(pathName){
        case "/":
            message = "See Everything In One View"
            statusCode = 200
            break;

        case "/overview":
            message = "See Everything In One View"
            statusCode = 200
            break;

        case "/products":
            message = "What would you want to buy? :)"
            statusCode = 200
            break;
        default:
            message = "Oops Page Not Found!"
            statusCode = 404;
            break    
    }
    res.writeHead(statusCode, {
        "Content-type": "text/html"
    })
    res.end(`<h1 style="text-align: center; margin-top: 30px; color: #555; text-transform: uppercase;">${message}</h1>`)
})


server.listen(5000, "localhost", () => {
    console.log("Server is listening on port 5000.")
})
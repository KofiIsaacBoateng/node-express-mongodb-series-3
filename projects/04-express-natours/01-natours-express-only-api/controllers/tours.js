// read data from ../dev-data/data/tours-simple.json
const path = require("path")
const fs = require("fs")


/** local json file read */
const simpleToursPath = path.join(__dirname, "..", "..", "dev-data", "data", "tours-simple.json") // simple data
const toursPath = path.join(__dirname, "..", "..", "dev-data", "data", "tours-simple.json") // robust data with a lot more fields

/*** simple tours read data parsed to json */
const tours = JSON.parse(
    fs.readFileSync(simpleToursPath)
)


module.exports.checkID = (req, res, next, val) => {
    const tour = tours.find(data => data.id === val * 1)

    if(!tour){
        return res.status(404).json({
            success: false,
            msg: `tour with id: ${val} not found`
        })
    }

    next()
}


module.exports.checkBody = (req, res, next) => {
    const {name, price} = req.body

    if(!name || !price){
        return res.status(400).json({
            success: false,
            msg: `name and price of tour cannot be undefined!`
        })
    }

    next()
} 


// get all tours
module.exports.getAllTours = (req, res) => {
    res.status(200).json({
        success: true,
        results: tours.length,
        data: tours
    })
}

// get tour 
module.exports.getTour = (req, res) => {
    const { id } = req.params
    
    const tour = tours.find(data => data.id === id * 1)

    res.status(200).json({
        success: true,
        data: tour
    })

}


// create tour
module.exports.createTour = (req, res) => {
    if(!req.body){
        res.status(400).json({
            success: false,
            msg: "body is required for a post request"
        })
    }

    const newTourId = (tours[tours.length - 1].id * 1) + 1
    const newTour = Object.assign({id: newTourId}, req.body)
    tours.push(newTour)

    fs.writeFile(
        simpleToursPath,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                success: true,
                data: newTour
            })
        }
    )
}


// update a tour 
module.exports.updateTour = (req, res) => {
    const {id} = req.params
    const body = req.body

    if(!req.body){
        res.status(400).json({
            success: false,
            msg: "body is required for a post request"
        })
    }

    const tour = tours.find(data => data.id === id * 1)

    const notTour = tours.filter(data => data.id !== id * 1)
    const updatedTour = {
        ...tour,
        ...body
    } 
    const updatedTours = [
        ...notTour,
        updatedTour
    ]

    const sortedUpdatedTour = updatedTours.sort((a, b) => a.id - b.id)

    fs.writeFile(
        simpleToursPath,
        JSON.stringify(sortedUpdatedTour),
        (err) => {
            res.status(200).json({
                success: true,
                data: sortedUpdatedTour
            })
        }
    )
    
}


module.exports.deleteTour = (req, res) => {
    const {id} = req.params

    const notTour = tours.filter(data => data.id !== id * 1)

    const sortedUpdatedTour = notTour.sort((a, b) => a.id - b.id)

    fs.writeFile(
        simpleToursPath,
        JSON.stringify(sortedUpdatedTour),
        (err) => {
            res.status(200).json({
                success: true,
                data: updatedTour
            })
        }
    )
    
}
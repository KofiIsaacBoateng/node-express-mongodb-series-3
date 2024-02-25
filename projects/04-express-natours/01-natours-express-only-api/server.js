const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000



/** middlewares */
app.use(express.json())

// read data from ../dev-data/data/tours-simple.json
const simpleToursPath = path.join(__dirname, "..", "dev-data", "data", "tours-simple.json") // simple data
const toursPath = path.join(__dirname, "..", "dev-data", "data", "tours-simple.json") // robust data with a lot more fields
const users = path.join(__dirname, "..", "dev-data", "data", "users.json") // robust data with a lot more fields

const tours = JSON.parse(
    fs.readFileSync(simpleToursPath)
)

/** API - TOURS */

// get all tours
const getAllTours = (req, res) => {
    res.status(200).json({
        success: true,
        results: tours.length,
        data: tours
    })
}

// get tour 
const getTour = (req, res) => {
    const { id } = req.params
    
    const tour = tours.find(data => data.id === id * 1)

    if(!tour){
        res.status(404).json({
            success: false,
            msg: `Tour with id: ${id} not found.`
        })
    }


    res.status(200).json({
        success: true,
        data: tour
    })

}


// create tour
const createTour = (req, res) => {
    console.log(req.body)

    if(!req.body){
        res.status(400).json({
            success: false,
            msg: "body is required for a post request"
        })
    }

    const newTourId = (tours[tours.length - 1].id * 1) + 1
    const newTour = Object.assign({id: newTourId}, req.body)
    tours.push(newTour)

    fs.writeFileSync(
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
const updateTour = (req, res) => {
    const {id} = req.params
    const body = req.body

    if(!req.body){
        res.status(400).json({
            success: false,
            msg: "body is required for a post request"
        })
    }

    const tour = tours.find(data => data.id === id * 1)

    if(!tour){
        res.status(404).json({
            success: false,
            msg: `tour with id: ${id} not found`
        })
    }

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

const deleteTour = (req, res) => {
    const {id} = req.params

    const tour = tours.find(data => data.id === id * 1)

    if(!tour){
        res.status(404).json({
            success: false,
            msg: `tour already deleted`
        })
    }

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



/****   API - USERS   ***/

// get all users 
const getAllUsers = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        success: false,
        msg: "Sorry! route not defined yet"
    })
}





{/**** RECOMMENDED over second option */}
const tourRouter = express.Router()
const userRouter = express.Router()

/*** recommended routes - tours */
tourRouter.route("/")
    .get(getAllTours)
    .post(createTour)

tourRouter.route("/:id")
    .get(getTour)
    .patch(updateTour) 
    .delete(deleteTour)


/** good not bad routes - tours */
    // app.route("/api/v1/tours")
    //     .get(getAllTours)
    //     .post(createTour)

    // app.route("/api/v1/tours/:id")
    //     .get(getTour)
    //     .patch(updateTour)
    //     .delete(deleteTour)



/**** recommended routes - users */
userRouter.route("/")
    .get(getAllUsers)
    .post(createUser)


userRouter.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)


/** good but not bad routes - users */
    // app.route("/api/v1/users")
    //     .get(getAllUsers)
    //     .post(createUser)

    // app.route("/api/v1/users/:id")
    //     .get(getUser)
    //     .patch(updateUser)
    //     .delete(deleteUser)





app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`))
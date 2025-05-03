require('dotenv').config()
require('express-async-errors')

const express = require('express')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
const router = require('./routes/products')


const port = process.env.PORT || 3000
const app = express()

// middlewares
app.use(express.json())


// routes
app.use('/api/v1/products', router)

// products route


// error handling middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)


// connect to db and start the server
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connected to database')
        app.listen(port)
        console.log(`server is running on port ${port}...`)
    } catch (error) {
        console.log(error)
    }
}


start()
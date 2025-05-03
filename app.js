require('dotenv').config()
const connectDB = require('./db/connect')
const app = require('./controllers/products')


const port = 3000

const runServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connected to database')
        app.listen(port || 3000)
        console.log(`server is running on port ${port}`)
    } catch (error) {
        console.log(error)
    }
}



runServer()
const mongoose = require('mongoose')
const productsList = require('./products.json')
const Product = require('./models/product')
const connectDB = require('./db/connect')
require('dotenv').config()



const populate = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(productsList)
        console.log('Data populated successfully')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


populate()


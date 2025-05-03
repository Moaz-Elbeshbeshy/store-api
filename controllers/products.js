const express = require('express')
const Product = require('../models/product')



const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ name: 'vase table' })
    res.status(200).json({ products, nbHits: products.length })
}


const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, page, limit, numericFilters } = req.query
    const queryObject = {}

    // featured
    if (featured === 'true') {
        queryObject.featured = true
    } else if (featured === 'false') {
        queryObject.featured = false
    }

    // company
    if (company) {
        queryObject.company = company
    }

    // name
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }

    // numeric Filters
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }
        const regEx = /\b(<|>|<=|>=|=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        // console.log(numericFilters)                      // outputs price>40,rating<=4 as a single string
        // console.log(filters)                             // outputs price-$gt-40,rating-$lte-4 as a single string
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((items) => {           // first split will change price-$gt-40,rating-$lte-4 to [ 'price-$gt-40', 'rating-$lte-4' ]
            const [field, operator, value] = items.split('-')
            // console.log(field, operator, value)                                   // outputs price $gt 40 next line rating $gte 4
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        });
    }

    // Product.find(queryObject) returns a query object (not yet executed). This object is like a promise that hasn’t been awaited yet. It builds the basic "find" operation, but nothing is sent to MongoDB yet.
    let result = Product.find(queryObject)

    // sort
    if (sort) {
        const sortList = sort.split(',').join(' ')   // sort accepts values separated with space like ['name -price'] not ['name, -price']
        result = result.sort(sortList)               // we are chaining .sort to the result which we don't have yet. not until the await call is made
    } else {
        result = result.sort('createdAt')
    }

    // fields
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    // Pagination  
    const totalResults = await Product.countDocuments()
    const currentPage = Number(page) || 1
    const itemsPerPage = Number(limit) || 10
    const skip = (currentPage - 1) * itemsPerPage

    // Check if skip exceeds totalResults
    if (skip >= totalResults) {
        return res.status(200).json({ products: [], nbHits: 0 });
    }

    // if skip is within the range of total result
    result = result.skip(skip).limit(itemsPerPage)

    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}


module.exports = {
    getAllProducts,
    getAllProductsStatic,
}
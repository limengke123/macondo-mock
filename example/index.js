const path = require('path')
const { mock } = require('../lib/index.js')

const swaggerPath = path.resolve(__dirname, './.swagger')
const schemaPath = path.resolve(__dirname, '.')

mock({
    schemaOption: {
        schemaPath,
        swaggerPath
    }
})


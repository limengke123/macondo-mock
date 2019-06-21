const path = require('path')
const { mock } = require('../lib/index.js')

const swaggerPath = path.resolve(__dirname, './.swagger')

mock({
    filePath: swaggerPath
})


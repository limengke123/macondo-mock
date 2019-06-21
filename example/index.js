const path = require('path')
const mock = require('../lib/index')

const swaggerPath = path.resolve(__dirname, './.swagger')

mock(swaggerPath)


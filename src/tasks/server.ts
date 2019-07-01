import * as jsonServer from 'json-server'
import { optionTuple } from '../index'

export const startServer = ([option, dataPath]: optionTuple) => {
    const { port } = option
    const server = jsonServer.create()
    const router = jsonServer.router(dataPath)
    const middleware = jsonServer.defaults()

    server.use(middleware)
    server.use(jsonServer.bodyParser)
    server.use(router)
    server.listen(port, () => {
        console.log('mock server is start localhost:%s', port)
    })
}

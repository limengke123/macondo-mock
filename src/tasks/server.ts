import * as jsonServer from 'json-server'
import { optionTuple } from '../index'
import { success } from '../util/commonUtil'

export const startServer = ([option, dataPath]: optionTuple) => {
    const { serverOption } = option
    const { port } = serverOption!
    const app = jsonServer.create()
    const router = jsonServer.router(dataPath)
    const middleware = jsonServer.defaults()

    app.use(middleware)
    app.use(jsonServer.bodyParser)
    app.use(router)
    app.listen(port, () => {
        success(`mock server is start localhost: ${port}`, true)
    })
}

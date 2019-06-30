import * as jsonServer from 'json-server'

export const startServer = (dataPath: string, port: number = 3000) => {
    console.log(dataPath)
    const server = jsonServer.create()
    const router = jsonServer.router(dataPath)
    const middleware = jsonServer.defaults()

    server.use(middleware)
    server.use(jsonServer.bodyParser)
    server.use(router)
    server.listen(3000, () => {
        console.log('mock server is start localhost:%s', port)
    })
}

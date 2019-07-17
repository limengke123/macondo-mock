import * as jsonServer from 'json-server'
import {defaultOption, optionTuple} from '../index'
import { success } from '../util/commonUtil'

export const startServer = ([option, [dataPath, schemaNames]]: optionTuple<[string, string[]]>) => {
    const { serverOption } = option
    let { port } = serverOption!
    if (!port) {
        port = defaultOption.serverOption!.port
    }
    const app = jsonServer.create()
    const router = jsonServer.router(dataPath)
    const middleware = jsonServer.defaults()

    app.use(middleware)
    app.use(jsonServer.bodyParser)
    app.use(jsonServer.rewriter({
        '/*/*/*/*/*/*/*/*/*/*':'/$1@$2@$3@$4@$5@$6@$7@$8@$9@$10',
        '/*/*/*/*/*/*/*/*/*':'/$1@$2@$3@$4@$5@$6@$7@$8@$9',
        '/*/*/*/*/*/*/*/*':'/$1@$2@$3@$4@$5@$6@$7@$8',
        '/*/*/*/*/*/*/*':'/$1@$2@$3@$4@$5@$6@$7',
        '/*/*/*/*/*/*':'/$1@$2@$3@$4@$5@$6',
        '/*/*/*/*/*':'/$1@$2@$3@$4@$5',
        '/*/*/*/*':'/$1@$2@$3@$4',
        '/*/*/*':'/$1@$2@$3',
        '/*/*':'/$1@$2',
        '/*':'/$1',
    }))
    app.use(router)
    app.listen(port, () => {
        success(`mock server is start localhost: ${port}`, true)
        console.log('   you can access those links: ')
        schemaNames.forEach(name => {
            success(`http://localhost:${port}/${name}`)
        })
    })
}

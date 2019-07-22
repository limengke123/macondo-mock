import { loadConfig } from './tasks/loadConfig'
import { loadDir } from './tasks/loadDir'
import { generateSchema } from './tasks/generateSchema'
import { generateData } from './tasks/generateData'
import { startServer } from './tasks/server'
import { error } from './util/commonUtil'
import {option} from './core/option'

const mock = function (option: option = {}): void {
    Promise.resolve(option)
        // 1. 加载本地的「config」文件
        .then(loadConfig)
        // 2. 尝试生成本地「mock」文件夹，顺便读取「mock」文件夹下的 「schema」「swagger」文件夹下的文件内容
        .then(loadDir)
        // 3. 比较「schema」「swagger」内容，生成/跳过「schema」文件
        .then(generateSchema)
        // 4. 根据「schema」生成对应的「db.json」文件
        .then(generateData)
        // 5. 根据「db.json」开启本地服务
        .then(startServer)
        .catch((e: Error) => {
            error(e.message, true)
            process.exit(-1)
        })
}

export {
    mock,
    loadConfig,
    loadDir,
    generateData,
    generateSchema,
    startServer
}

export default mock

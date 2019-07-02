import { loadConfig } from './tasks/loadConfig'
import { generateSchema } from './tasks/generateSchema'
import { generateData } from './tasks/generateData'
import { startServer } from './tasks/server'
import { error } from './util/commonUtil'

export interface option {
    swaggerPath?: string,
    schemaPath?: string,
    port?: number
}

const defaultOption: option = {
    port: 3000
}

export type optionTuple = [option, any]

export const mock = function (option: option): void {
    Promise.resolve({...defaultOption, ...option})
        // 1. 加载本地的 config 文件
        .then(loadConfig)
        // 2. 生成 schema.json 文件
        .then(generateSchema)
        // 3. 生成对应的 data.json 文件
        .then(generateData)
        // 4. 开启本地服务
        .then(startServer)
        .catch((e: Error) => {
            error(e.message)
            error(e.stack, false)
            process.exit(-1)
        })
}

export default mock

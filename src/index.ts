import { loadConfig } from './tasks/loadConfig'
import { loadDir } from './tasks/loadDir'
import { generateSchema } from './tasks/generateSchema'
import { generateData } from './tasks/generateData'
import { startServer } from './tasks/server'
import { error } from './util/commonUtil'

/**
 * schemaOption swagger文本解析的设置
 * dbOption db上的设置
 * serverOption 本地服务的设置
 * */
export interface option {
    baseOption?: baseOption
    schemaOption?: schemaOption
    dbOption?: dbOption
    serverOption?: serverOption
}

export interface baseOption {
    mockPath?: string
}

export interface schemaOption {
    schemaPath?: string
    swaggerPath?: string,
}

export interface dbOption {
}

export interface serverOption {
    port?: number
}

const defaultOption: option = {
    baseOption: {
        mockPath: './mock'
    },
    schemaOption: {},
    dbOption: {},
    serverOption: {
        port: 3000
    }
}

export type optionTuple = [option, any]

const mock = function (option: option = {}): void {
    Promise.resolve({...defaultOption, ...option})
        // 1. 加载本地的 config 文件
        .then(loadConfig)
        .then(loadDir)
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

export {
    mock,
    loadConfig,
    generateData,
    generateSchema,
    startServer
}

export default mock

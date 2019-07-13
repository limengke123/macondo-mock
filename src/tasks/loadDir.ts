import * as path from 'path'
import {optionTuple} from '../index'
import { mkdir, readdir } from '../util/fsUtil'

const SWAGGER_PATH = './swagger'
const SCHEMA_PATH = './schema'

export function loadDir([option]: optionTuple<undefined>): Promise<optionTuple<[string[], string[]]>> {
    const { baseOption } = option
    const { mockPath } = baseOption!
    const mockRealPath = path.join(process.cwd(), mockPath!)
    const swaggerDirPath = path.resolve(mockRealPath, SWAGGER_PATH)
    const schemaDirPath = path.resolve(mockRealPath, SCHEMA_PATH)
    return Promise.resolve()
        .then(() => {
            // 尝试去创建一下目录
            return mkdir(mockRealPath)
                .then(() => {
                    //  version < 10.12 的node不支持直接创建多级目录，这里先建mock文件夹
                    const mkSwaggerDirPromise = mkdir(swaggerDirPath)
                    const mkSchemaDirPromise = mkdir(schemaDirPath)
                    return Promise.all([mkSwaggerDirPromise, mkSchemaDirPromise])
                })
        })
        .then(() => {
            // 不管这个文件夹到底有没有创建成功，直接去看里面有没有内容
            const swaggerFilePromise = readdir(swaggerDirPath)
            const schemaFilePromise = readdir(schemaDirPath)
            return Promise.all([swaggerFilePromise, schemaFilePromise])
        })
        .then(([swaggerFiles, schemaFiles]) => {
            if (!schemaFiles.length && !swaggerFiles.length) {
                // 两个文件都没有
                throw new Error(`${schemaDirPath}目录下没有schema文件，并且${swaggerDirPath}目录下也没有 swagger 文件，尝试在${swaggerDirPath}目录下添加swagger文件之后重试`)
            } else {
                return [
                    option,
                    [
                        swaggerFiles.map(file => path.join(swaggerDirPath, file)),
                        schemaFiles.map(file => path.join(schemaDirPath, file))
                    ]
                ]
            }
        })
}

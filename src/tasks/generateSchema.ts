import * as path from 'path'
import { generateSingleSchema } from '../core/generateSingleSchema'
import {diff, success} from '../util/commonUtil'
import {extractRelativePath} from '../util/fsUtil'
import {getOption} from '../core/option'

const ERROR_PATH = '2. 生成 schema.json： '

const option = getOption()


export function generateSchema ([swaggerFiles, schemaFiles]:[string[], string[]]): Promise<string[]> {
    const mockDir = option.baseOption!.mockPath!
    const force = option.schemaOption!.force
    return Promise.resolve()
        .then(() => {
            let patches = swaggerFiles
            if (!force) {
                // 非强制生成，对swaggerFiles和schemaFiles做一次diff，找出有差异的文件
                patches = diff(swaggerFiles, schemaFiles, ((a, b) => {
                    a = extractRelativePath(a, '/swagger')
                    a = a.split('.')[0]
                    b = extractRelativePath(b, '/schema')
                    b = b.split('.')[0]
                    return a === b
                }))
            }
            if (patches.length === 0) {
                success(`${ERROR_PATH} 跳过生成 schema 文件步骤`)
            }
            // 强制生成，那就全量处理swagger文件
            const batchGenerateSchemaPromise = patches.map(swaggerFile => {
                const fileName = path.parse(swaggerFile).name
                const relativePath = path.parse(extractRelativePath(swaggerFile, '/swagger')).dir
                const absoluteSchemaPath = path.join(process.cwd(), mockDir, './schema', relativePath)
                return generateSingleSchema(swaggerFile, absoluteSchemaPath, fileName)
            })
            return Promise.all(batchGenerateSchemaPromise)
        })
        .then(schemaFilePaths => {
            // 合并去重一下读取的schemaFiles和生成的schemaFiles
            return Array.from(new Set<string>([...schemaFilePaths, ...schemaFiles]))
        })
}

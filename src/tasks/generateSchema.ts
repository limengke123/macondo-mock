import * as path from 'path'
import { generateSingleSchema } from '../core/generateSingleSchema'
import { optionTuple } from '../index'
import {diff, success} from '../util/commonUtil'

const ERROR_PATH = '2. 生成 schema.json： '

export function generateSchema ([option, [swaggerFiles, schemaFiles]]: optionTuple<[string[], string[]]>): Promise<optionTuple<string[]>> {
    const mockDir = option.baseOption!.mockPath!
    const force = option.schemaOption!.force
    return Promise.resolve()
        .then(() => {
            let patches = swaggerFiles
            if (!force) {
                // 非强制生成，对swaggerFiles和schemaFiles做一次diff，找出有差异的文件
                patches = diff(swaggerFiles, schemaFiles, ((a, b) => path.parse(a).name === path.parse(b).name))
            }
            // 强制生成，那就全量处理swagger文件
            const batchGenerateSchemaPromise = patches.map(swaggerFile => {
                const absoluteSchemaPath = path.join(process.cwd(), mockDir, './schema')
                const fileName = path.parse(swaggerFile).name
                return generateSingleSchema(swaggerFile, absoluteSchemaPath, fileName)
            })
            return Promise.all(batchGenerateSchemaPromise)
        })
        .then(schemaFilePaths => {
            // 合并去重一下读取的schemaFiles和生成的schemaFiles
            return [option, Array.from(new Set<string>([...schemaFilePaths, ...schemaFiles]))]
        })
}

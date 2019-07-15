import * as path from 'path'
import { generateSingleSchema } from '../core/generateSingleSchema'
import { optionTuple } from '../index'
import {success} from '../util/commonUtil'

const ERROR_PATH = '2. 生成 schema.json： '

export function generateSchema ([option, [swaggerFiles, schemaFiles]]: optionTuple<[string[], string[]]>): Promise<optionTuple<string[]>> {
    const mockDir = option.baseOption!.mockPath!
    return Promise.resolve()
        .then(() => {
            // todo: 这里先强制生成scehma文件， 后续优化
            // if (schemaFiles.length && schemaFiles.length === swaggerFiles.length) {
            //     // 这里先偷个懒，判断swagger和schema的长度，长度相同就不去生成schema todo: 后期优化需要依据name去辨别
            //     success(`${ERROR_PATH} 跳过生成 schema.json 文件步骤`)
            //     return schemaFiles
            // }
            const batchGenerateSchemaPromise = swaggerFiles.map(swaggerFile => {
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

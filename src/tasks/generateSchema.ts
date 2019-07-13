import * as path from 'path'
import { generateSingleSchema } from '../core/generateSingleSchema'
import { optionTuple } from '../index'
import {success} from '../util/commonUtil'

const ERROR_PATH = '2. 生成 schema.json： '

export function generateSchema ([option, [swaggerFiles, schemaFiles]]: optionTuple<[string[], string[]]>): Promise<optionTuple<string[]>> {
    const mockDir = option.baseOption!.mockPath!
    return Promise.resolve()
        .then(() => {
            if (schemaFiles.length && schemaFiles.length === swaggerFiles.length) {
                // 这里先偷个懒，判断swagger和schema的长度，长度相同就不去生成schema todo: 后期优化需要依据name去辨别
                success(`${ERROR_PATH} 跳过生成 schema.json 文件步骤`)
                return schemaFiles
            }
            const batchGenerateSchemaPromise = swaggerFiles.map(swaggerFile => {
                const absoluteSchemaPath = path.join(process.cwd(), mockDir, './schema')
                const fileName = path.parse(swaggerFile).name
                return generateSingleSchema(swaggerFile, absoluteSchemaPath, fileName)
            })
            return Promise.all(batchGenerateSchemaPromise)
        })
        .then(schemaFilePaths => {
            return [option, schemaFilePaths]
        })
}

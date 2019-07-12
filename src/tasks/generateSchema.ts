import * as path from 'path'
import * as fs from 'fs'
import { generateSingleSchema } from '../core/generateSingleSchema'
import { optionTuple } from '../index'

const SCHEMA_FILE = './schema.json'

export function generateSchema ([option, [swaggerFiles, schemaFiles]]: optionTuple<[string[], string[]]>): Promise<optionTuple<fs.PathLike>> {
    const { schemaOption } = option
    const { schemaPath } = schemaOption!
    const SCHEMA_FILE_PATH = path.resolve(schemaPath as string, SCHEMA_FILE)
    return Promise.resolve()
        .then(() => {
            return generateSingleSchema(schemaPath!, SCHEMA_FILE_PATH, false)
        })
        .then(filePath => {
            return [option, filePath]
        })
}

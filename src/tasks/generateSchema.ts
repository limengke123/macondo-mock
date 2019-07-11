import * as path from 'path'
import { generateSingleSchema } from '../core/generateSingleSchema'
import { optionTuple } from '../index'

const SCHEMA_FILE = './schema.json'

export function generateSchema ([option]: optionTuple): Promise<optionTuple> {
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

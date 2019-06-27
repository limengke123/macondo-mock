import { readJsonFile } from '../util'

const ENTRY = 'Result'
const DATA = 'data'

export function generateData (schemaPath: string) {
    return Promise.resolve()
        .then(() => readJsonFile(schemaPath))
        .then((schema: object) => {
            console.log(schema)
        })
}

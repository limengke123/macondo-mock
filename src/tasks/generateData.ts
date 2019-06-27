import { readJsonFile } from '../util'

export function generateData (schemaPath: string) {
    return Promise.resolve()
        .then(() => readJsonFile(schemaPath))
        .then((schema: object) => {
            console.log(schema)
        })
}

import { generateSchema } from './tasks/generateSchema'
import { generateData } from './tasks/generateData'

export interface option {
    swaggerPath: string,
    schemaPath: string
}

export const mock = function (option: option): void {
    Promise.resolve()
        // 生成 schema.json 文件
        .then(() => generateSchema(option))
        // 生成对应的 data 文件
        .then(generateData)
        .catch((e: Error) => {
            console.log(e.message)
            console.log(e.stack)
            process.exit(-1)
        })
}

export default mock

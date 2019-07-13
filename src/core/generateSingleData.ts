import * as fs from 'fs'
import {readJsonFile} from '../util/fsUtil'
import {parse} from './parser'
import {Ischema} from './resolver'

const ENTRY = 'Result'
const ERROR_PATH = '3. 生成db.json： '

export const generateSingleData = function (schemaPath: fs.PathLike, schemaName: string): Promise<[myObject<Ischema>, string]> {
    return Promise.resolve()
        .then(() => readJsonFile<myObject<myObject<Ischema>>>(schemaPath))
        .then(schema => {
            if (!schema[ENTRY]) {
                throw new Error(ERROR_PATH + schemaName + ' 不存在 Result 字段，无法解析')
            }
            return [parse(schema[ENTRY], schema), schemaName]
        })
}

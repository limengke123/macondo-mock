import * as fs from 'fs'
import {readJsonFile} from '../util/fsUtil'
import {parse} from './parser'
import {Ischema} from './resolver'

const ENTRY = 'Result'
const ERROR_PATH = '3. 生成db.json： '

export const generateSingleData = function (schemaPath: fs.PathLike, schemaName: string):Promise<[any, string]> {
    return Promise.resolve()
        .then(() => readJsonFile(schemaPath))
        .then((schema): any => {
            if (!schema[ENTRY]) {
                throw new Error(ERROR_PATH + '不存在 Result 字段，无法解析')
            }
            return [parse(schema[ENTRY] as {[key: string]: Ischema}, schema), schemaName]
        })
}

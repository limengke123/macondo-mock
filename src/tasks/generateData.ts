import * as path from 'path'
import { readJsonFile, writeFile, accessFile, access } from '../util/fsUtil'
import { parse } from '../core/parser'
import { Ischema } from '../core/resolver'
import {optionTuple} from '../index'
import { success } from '../util/commonUtil'

const ENTRY = 'Result'
const ERROR_PATH = '3. 生成db.json： '

export function generateData ([option, schemaPath]: optionTuple, force: boolean = false): Promise<optionTuple> {
    return Promise.resolve()
    // todo: 解决db.json文件的重复多次生成
        .then(() => readJsonFile(schemaPath))
        .then((schema): any => {
            if (!schema[ENTRY]) {
                throw new Error(ERROR_PATH + '不存在 Result 字段，无法解析')
            }
            return parse(schema[ENTRY] as {[key: string]: Ischema}, schema)
        })
        .then(result => {
            const dataPath = path.resolve(schemaPath, '..', './db.json')
            const data = {
                result: result
            }
            const writePromise = writeFile(dataPath, JSON.stringify(data))
            return Promise.all([dataPath, writePromise])
        })
        .then(([dataPath, _]) => {
            success(`${ERROR_PATH}成功生成数据文件：${dataPath}`,)
            return [
                option,
                dataPath
            ]
        })
}

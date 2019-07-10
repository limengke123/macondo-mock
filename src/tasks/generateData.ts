import * as path from 'path'
import { readJsonFile, writeFile, accessFile, access } from '../util/fsUtil'
import { parse } from '../core/parser'
import { Ischema } from '../core/resolver'
import {optionTuple} from '../index'
import { success } from '../util/commonUtil'

const ENTRY = 'Result'
const ERROR_PATH = '3. 生成db.json： '
const DB_JSON_FILE = './db.json'

export function generateData ([option, schemaPath]: optionTuple, force: boolean = false): Promise<optionTuple> {
    const dataPath = path.resolve(schemaPath, '..', DB_JSON_FILE)
    if (!force) {
        return accessFile(DB_JSON_FILE)
            .then(([exists]: access) => {
                if (!exists) {
                    return _generateData()
                } else {
                    success(`${ERROR_PATH}${DB_JSON_FILE}文件已经存在，跳过生成 db.json 文件步骤`)
                    return [option, dataPath]
                }
            })
    } else {
        return _generateData()
    }
    function _generateData(): Promise<optionTuple> {
        return Promise.resolve()
            .then(() => readJsonFile(schemaPath))
            .then((schema): any => {
                if (!schema[ENTRY]) {
                    throw new Error(ERROR_PATH + '不存在 Result 字段，无法解析')
                }
                return parse(schema[ENTRY] as {[key: string]: Ischema}, schema)
            })
            .then(result => {
                const data = {
                    result: result
                }
                const writePromise = writeFile(dataPath, JSON.stringify(data))
                return Promise.all([dataPath, writePromise])
            })
            .then(([dataPath]) => {
                success(`${ERROR_PATH}成功生成数据文件：${dataPath}`,)
                return [
                    option,
                    dataPath
                ]
            })
    }
}

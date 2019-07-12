import * as path from 'path'
import { writeFile, accessFile, access } from '../util/fsUtil'
import {optionTuple} from '../index'
import { success } from '../util/commonUtil'
import { generateSingleData } from '../core/generateSingleData'
import * as fs from 'fs'

const ENTRY = 'Result'
const ERROR_PATH = '3. 生成db.json： '
const DB_JSON_FILE = './db.json'

export function generateData ([option, schemaPath]: optionTuple<fs.PathLike>, force: boolean = false): Promise<optionTuple<fs.PathLike>> {
    const dataPath = path.resolve(schemaPath as string, '..', DB_JSON_FILE)
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
    function _generateData(): Promise<optionTuple<fs.PathLike>> {
        return Promise.resolve()
            .then(() => generateSingleData(schemaPath, ENTRY))
            .then(([result, name]) => {
                const data = {
                    [name]: result
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

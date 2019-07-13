import * as path from 'path'
import { writeFile, accessFile, access } from '../util/fsUtil'
import {optionTuple} from '../index'
import { success } from '../util/commonUtil'
import { generateSingleData } from '../core/generateSingleData'
import {Ischema} from '../core/resolver'

const ERROR_PATH = '3. 生成db.json： '
const DB_JSON_FILE = './db.json'

export function generateData ([option, schemaPaths]: optionTuple<string[]>, force: boolean = true): Promise<optionTuple<string>> {
    const dataPath = path.resolve(option.baseOption!.mockPath!, DB_JSON_FILE)
    if (!force) {
        return accessFile(dataPath)
            .then(([exists]: access) => {
                if (!exists) {
                    return _generateData()
                } else {
                    success(`${ERROR_PATH}${dataPath}文件已经存在，跳过生成 db.json 文件步骤`)
                    return [option, dataPath]
                }
            })
    } else {
        return _generateData()
    }
    // 生成data数据
    function _generateData(): Promise<optionTuple<string>> {
        return Promise.resolve()
            .then(() => Promise.all(schemaPaths.map(schemaPath => generateSingleData(schemaPath, path.parse(schemaPath).name))))
            .then((dataList) => {
                let data: myObject<myObject<Ischema>> = {}
                dataList.forEach(([result, name]) => {
                    data[name] = result
                })
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

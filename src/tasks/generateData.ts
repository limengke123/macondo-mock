import * as path from 'path'
import {writeFile, accessFile, access, extractRelativePath} from '../util/fsUtil'
import {optionTuple} from '../index'
import { success } from '../util/commonUtil'
import { generateSingleData } from '../core/generateSingleData'

const ERROR_PATH = '3. 生成db.json： '
const DB_JSON_FILE = './db.json'

// /search/rule/hhh.json -> search@rule@hhh
function generateKeyName(schemaPath: string, interfaceName?:string, separator: string = '@'): string {
    const pathArr = schemaPath.replace(/\/([\w/]*)\.json/, (_, a) => {
        return a
    }).split('/')
    let fileName = pathArr[pathArr.length - 1]
    let pathName = pathArr.slice(0, pathArr.length - 1)
    if (interfaceName) {
        fileName = interfaceName.replace(/\[(name)]/g, () => {
            return fileName
        })
    }
    return pathName.concat(fileName).join(separator)
}

export function generateData ([option, schemaPaths]: optionTuple<string[]>): Promise<optionTuple<[string, string[]]>> {
    const keyNames = schemaPaths.map(schemaPath => {
        return generateKeyName(extractRelativePath(schemaPath, '/schema'), option.serverOption!.interfaceName, '/')
    })
    const dataPath = path.resolve(option.baseOption!.mockPath!, DB_JSON_FILE)
    const force = option.dbOption!.force
    if (!force) {
        return accessFile(dataPath)
            .then(([exists]: access) => {
                if (!exists) {
                    return _generateData()
                } else {
                    success(`${ERROR_PATH} 跳过生成 db.json 文件步骤`)
                    return [option, [dataPath, keyNames]]
                }
            })
    } else {
        return _generateData()
    }
    // 生成data数据
    function _generateData(): Promise<optionTuple<[string, string[]]>> {
        return Promise.resolve()
            .then(() => {
                return Promise.all(schemaPaths.map(schemaPath => {
                    return generateSingleData(schemaPath, extractRelativePath(schemaPath, '/schema'))
                }))
            })
            .then((dataList) => {
                let data: myObject<myObject<any>> = {}
                dataList.forEach(([result, name]) => {
                    const keyName = generateKeyName(name, option.serverOption!.interfaceName, '@')
                    data[keyName] = result
                })
                const writePromise = writeFile(dataPath, JSON.stringify(data))
                return Promise.all([dataPath, writePromise])
            })
            .then(([dataPath]) => {
                success(`${ERROR_PATH}成功生成数据文件：${dataPath}`,)
                return [
                    option,
                    [dataPath, keyNames]
                ]
            })
    }
}

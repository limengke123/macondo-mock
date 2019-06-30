import * as path from 'path'
import * as Mock from 'mockjs'
import { readJsonFile, writeFile } from '../util'
import { Ischema, Resolver } from '../resolver'

const ENTRY = 'Result'

export function generateData (schemaPath: string) {
    return Promise.resolve()
        .then(() => readJsonFile(schemaPath))
        .then((schema): any => {
            if (!schema[ENTRY]) {
                return Promise.reject('不存在 Result 字段，无法解析')
            }
            return parse(schema[ENTRY] as {[key: string]: Ischema}, schema)
        })
        .then(result => {
            const dataPath = path.resolve(schemaPath, '..', './data.json')
            const data = {
                result: result
            }
            const writePromise = writeFile(dataPath, JSON.stringify(data))
            return Promise.all([dataPath, writePromise])
        })
        .then(([dataPath, _]) => {
            console.log('成功生成数据文件：%s', dataPath)
            return dataPath
        })
}


function parse<T, K extends keyof T>(root: T, source: any): Map<string, Ischema>  {
    const keys = Object.keys(root) as K[]
    let result = {} as any
    return keys.reduce((accu, currentKey) => {
        const schema = root[currentKey] as Ischema
        const { type, generics, mock, data } = schema
        if (data) {
            // 存在data字段了， 不需要搞别的值了
            accu[currentKey] = data
        } else {
            if (type === 'array') {
                if (!generics) {
                    throw new Error('数组类型缺少泛型 generics')
                }
                const length = Mock.mock(mock)
                if (source[generics]) {
                    // 其他类型的值
                    accu[currentKey] = new Array(length).fill(0).map(() => parse(source[generics], source))
                } else {
                    // 基本类型的值
                    const { mock } = Resolver.getType(generics)
                    accu[currentKey] = new Array(length).fill(0).map(() => Mock.mock(mock))
                }
            } else {
                if (mock) {
                    // 一般类型
                    if (type === 'string') {
                        // 有可能是数字类型的，需要专程字符串
                        accu[currentKey] = '' + Mock.mock(mock)
                    }
                    accu[currentKey] = Mock.mock(mock)
                } else {
                    // 复合类型
                    accu[currentKey] = parse(source[type || ''], source)
                }
            }
        }
        return accu
    }, result)
}


import { readJsonFile } from '../util'
import { Ischema, Resolver } from '../resolver'

const ENTRY = 'Result'

export function generateData (schemaPath: string) {
    return Promise.resolve()
        .then(() => readJsonFile(schemaPath))
        .then((schema): any => {
            if (!schema[ENTRY]) {
                return Promise.reject('不存在 Result 字段，无法解析')
            }
            const result = parse(schema[ENTRY] as {[key: string]: Ischema}, schema)
            // @ts-ignore
            console.log(result.data.feedbackDos)
        })
}


function parse<T, K extends keyof T>(root: T, source: any): Map<string, Ischema>  {
    const keys = Object.keys(root) as K[]
    let result = {} as any
    return keys.reduce((accu, currentKey) => {
        const schema = root[currentKey] as Ischema
        const { type, generics, length, comment, data, optional } = schema
        if (data) {
            // 存在data字段了， 不需要搞别的值了
            accu[currentKey] = data
        } else {
            if (type === 'array') {
                if (!generics) {
                    throw new Error('数组类型缺少泛型 generics')
                }
                if (source[generics]) {
                    // 其他类型的值
                    accu[currentKey] = new Array(length).fill(0).map(() => parse(source[generics], source))
                } else {
                    // 基本类型的值
                    accu[currentKey] = new Array(length).fill(0).map(() => Resolver.getType(generics).defaultValue)
                }
            } else {
                accu[currentKey] = parse(source[type || ''], source)
            }
        }
        return accu
    }, result)
}


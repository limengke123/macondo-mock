import {Ischema, Resolver} from './resolver'
import * as Mock from 'mockjs'

const ERROR_PATH = '3. 生成db.json： '

export function parse<T, K extends keyof T>(root: T, source: any): Map<string, Ischema>  {
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
                    throw new Error(ERROR_PATH + '数组类型缺少泛型 generics')
                }
                const length = getMockData(mock)
                if (source[generics]) {
                    // 其他类型的值
                    accu[currentKey] = new Array(length).fill(0).map(() => parse(source[generics], source))
                } else {
                    // 基本类型的值，把数组的名字传进去，拿到匹配的mock
                    const { mock } = Resolver.getType(generics, currentKey as string)
                    accu[currentKey] = new Array(length).fill(0).map(() => getMockData(mock))
                }
            } else {
                if (mock) {
                    // 一般类型
                    accu[currentKey] = getMockData(mock)
                } else {
                    // 复合类型
                    accu[currentKey] = parse(source[type || ''], source)
                }
            }
        }
        return accu
    }, result)
}

const getMockData = (mock: any): any => {
    // 获取mock的值
    if (typeof mock !== 'string') {
        const regexp = new RegExp(mock.regexp)
        return Mock.mock({regexp}).regexp
    } else {
        return Mock.mock(mock)
    }
}
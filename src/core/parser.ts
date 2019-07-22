import {Ischema, Resolver} from './resolver'
import * as Mock from 'mockjs'
import {getOption} from './option'

const ERROR_PATH = '3. 生成db.json： '
const option = getOption()

export function parse(
    root: Dictionary<Ischema>,
    source: Dictionary<Dictionary<Ischema>>,
    type?: string,
    depth: number = option.schemaOption.recursiveDepth,
    linkNodes: string[] = [],
): Dictionary<any>  {
    if (!root) {
        throw new Error(`生成数据失败，未能找到 ${type} 字段`)
    }
    const keys = Object.keys(root)
    let result: Dictionary<any> = {}
    return keys.reduce((accu, currentKey) => {
        const schema = root[currentKey]
        const { type, generics, mock, data, length } = schema
        if (data) {
            // 存在data字段了， 不需要搞别的值了
            accu[currentKey] = data
        } else {
            if (type === 'array') {
                if (!generics) {
                    throw new Error(ERROR_PATH + '数组类型缺少泛型 generics')
                }
                const arrayLength = length ? length : getMockData(mock)
                if (source[generics]) {
                    // 其他类型的值
                    const linkNode = linkNodes.filter(name => name === generics)[0]
                    if (linkNode) {
                        // 解决循环引用问题
                        depth--
                    } else {
                        linkNodes.push(generics)
                    }
                    if (depth <= 0) {
                        accu[currentKey] = []
                        return accu
                    }
                    accu[currentKey] = new Array(arrayLength)
                        .fill(0)
                        .map(() => parse(source[generics], source, generics, depth, linkNodes))
                } else {
                    // 基本类型的值，把数组的名字传进去，拿到匹配的mock
                    const { mock } = Resolver.getType(generics, currentKey)
                    accu[currentKey] = new Array(arrayLength)
                        .fill(0)
                        .map(() => getMockData(mock))
                }
            } else {
                if (mock) {
                    // 一般类型
                    accu[currentKey] = getMockData(mock)
                } else {
                    // 复合类型
                    const linkNode = linkNodes.filter(name => name === type)[0]
                    if (linkNode) {
                        // 解决循环引用
                        depth--
                    } else {
                        linkNodes.push(type!)
                    }
                    if (depth <= 0) {
                        // 解决循环引用问题
                        accu[currentKey] = null
                        return accu
                    }
                    accu[currentKey] = parse(source[type!], source, type, depth, linkNodes)
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

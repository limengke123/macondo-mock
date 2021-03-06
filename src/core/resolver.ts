import {Result} from 'range-parser'
import {getOption} from './option'

// swagger文档的解析正则
const leftBrace: RegExp = /\s*(.*)\s*{\s*/g
const rightBrace: RegExp = /.*}.*/g
const bodyReg: RegExp = /^\s*(\w+)\s*\(([«»\][\w]+),?\s*(\w+)?\):?(.+)?/g
const arrReg: RegExp = /array\[(\w+)]$/g
// 字段修饰正则，去推测字段名对应的 mock 类型
const timeReg: RegExp = /\w*(?:[dD]ate)|(?:[tT]ime)\w*/
const idReg: RegExp = /\w*[iI]d$/
const userNameReg: RegExp = /\w*[nN]ame$/
const provinceReg: RegExp = /^province(?:Name)?$/
const cityReg: RegExp = /^city(?:Name)?$/
const picReg: RegExp = /\w*[pP]ics?|\w*[pP]ictures?|\w*[iI]mgs?|\w*[iI]mages?/
const codeReg: RegExp = /\w*[cC]ode$/
const phoneReg: RegExp = /\w*[pP]hone(?:Number)?/

const RESULT = 'Result'
const DATA = 'data'

const option = getOption()

export interface Iline {
    name: string
    type?: string
    optional?: boolean
    comment?: string
}

export type Iresult = Dictionary<Iline[]>

export interface Ischema {
    type?: string,
    optional?: boolean,
    comment?: string,
    generics?: string,
    mock?: string | {regexp: string},
    data?: any,
    length?: number
}

export class Resolver {
    private readonly source : Iresult = {}
    private schemaJson: {[propName: string]: Ischema} = {}
    constructor(source: Iresult) {
        this.source = source
    }

    generate (): never | void {
        if (!this.source[RESULT]) {
            throw new Error(`不存在${RESULT}字段，无法解析`)
        }
        const rootData = this.source[RESULT].find((item: Iline) => item.name === DATA)
        if (!rootData) {
            throw new Error(`在${RESULT}字段上不存在${DATA}字段，无法解析`)
        }
        const keys = Object.keys(this.source)
        keys.forEach(key => {
            this.schemaJson[key] = this.source[key].reduce((accu: {[propName: string]: Ischema}, current: Iline) => {
                const {name, comment, optional, type} = current
                const {transformType, generics, mock, data, length} = Resolver.getType(type || '', name)
                accu[name] = {
                    type: transformType,
                    comment,
                    optional,
                }
                if (mock) {
                    accu[name].mock = mock
                }
                if (data) {
                    accu[name].data = data
                }
                if (length) {
                    accu[name].length = length
                }
                if (transformType === 'array') {
                    accu[name].generics = generics
                }
                return accu
            }, {})
        })
    }

    static getType (type: string, name?: string): {length?: number, data?: any, transformType: string, generics?: string, mock?: string | {regexp: string} } {
        let result: {length?: number, data?: any, transformType:string, generics?: string, mock?: string | {regexp: string}} = {transformType: type}

        if (arrReg.test(type)) {
            return {
                generics: Resolver.resolveArray(type),
                mock: option!.schemaOption!.global!.array,
                ...result,
                transformType: 'array',
            }
        }
        switch (type) {
        case 'string':
            result.mock = Resolver.handleStringMock(name)
            break
        case 'integer':
            result.transformType = 'number'
            result.mock = Resolver.handleNumberMock(name)
            break
        case 'number':
            result.mock = Resolver.handleNumberMock(name)
            break
        case 'boolean':
            result.mock = option.schemaOption.global.boolean
            break
        case 'object':
            result.data = option.schemaOption.global.object
            break
        default:
            break
        }
        if (option && option.schemaOption!.surmise && name) {
            // 注入配置的类型推断
            const surmises = Array.isArray(option.schemaOption.surmise)
                ? option.schemaOption!.surmise
                : [option.schemaOption!.surmise]
            surmises.forEach(surmise => {
                const regexp = new RegExp(surmise.test)
                if (regexp.test(name)) {
                    if (surmise.mock) {
                        result.mock = surmise.mock
                    }
                    if (surmise.data) {
                        result.data = surmise.data
                    }
                    if (surmise.length) {
                        result.length = surmise.length
                    }
                }
            })
        }

        return result
    }

    static handleStringMock (name: string = ''): string | {regexp: string} {
        if (timeReg.test(name)) {
            return '@datetime'
        }
        if (idReg.test(name)) {
            return '@increment'
        }
        if (provinceReg.test(name)) {
            return '@province'
        }
        if (cityReg.test(name)) {
            return '@city'
        }
        if (picReg.test(name)) {
            return '@image'
        }
        if (codeReg.test(name)) {
            return '@string("lower", 8)'
        }
        if (phoneReg.test(name)) {
            // json 不支持正则表达式，这里给他转换成字符串
            return {
                regexp: '\\d{11}'
            }
        }
        if (userNameReg.test(name)) {
            return '@cname'
        }
        return option.schemaOption.global.string || ''
    }

    static handleNumberMock (name: string = ''): string {
        if (idReg.test(name)) {
            return '@increment'
        }
        return option.schemaOption.global.number || ''
    }

    static resolveArray (str: string): string {
        let result: string = ''
        str.replace(arrReg, (_, generics) => {
            result = generics
            return str
        })
        return result
    }


    getSchemaJson (): {[propName: string]: Ischema} {
        return this.schemaJson
    }
}

export class Receiver {
    offset: number = 0
    header: string = ''
    result: Iresult = {}

    receive (line: string): never | this {
        if (leftBrace.test(line)) {
            // 遇到了 {
            if (this.offset !== 0) {
                throw new Error('swagger文档格式有问题，连续出现两个 { { ，检查是否格式有问题')
            }
            this.offset = -1
            line.replace(leftBrace, (_, name: string) => {
                if (name.indexOf(RESULT) > -1) {
                    // swagger的入口
                    this.header = RESULT
                } else {
                    this.header = name.trim()
                }
                return line
            })
            this.result[this.header] = []
            return this
        }
        if (rightBrace.test(line)) {
            // 遇到了 } 说明当前段落 已经结束
            if (this.offset !== -1) {
                throw new Error('swagger 文档格式有问题，解析 } 出现错误，是否缺少了 {')
            }
            this.offset = 0
            this.header = ''
            return this
        }
        if (bodyReg.test(line)) {
            // 正常需要解析的行
            if (this.offset !== -1 || !this.header) {
                // 不存在header的时候 直接报错
                throw new Error('swagger 文档格式有问题，解析内容出现错误， 是否缺少 {')
            }
            const lineResult = this.resolveBody(line)
            this.result[this.header].push(lineResult)
            return this
        }
        return this
    }

    resolveBody (line: string): Iline {
        let lineResult: Iline = {name: ''}
        line.replace(bodyReg, (_, name, type, optional, comment) => {
            lineResult = {
                name: name.trim(),
                type,
                optional: !!optional,
                comment: comment || ''
            }
            return line
        })
        return lineResult
    }

    getSchemaJson (): {[propName: string]: Ischema} {
        const resolver = new Resolver(this.result)
        try {
            resolver.generate()
        } catch (e) {
            console.log(e.message)
            process.exit(1)
        }
        return resolver.getSchemaJson()
    }

    static instance (): Receiver {
        return new Receiver()
    }
}

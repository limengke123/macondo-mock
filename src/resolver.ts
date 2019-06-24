const leftBrace: RegExp = /\s*(.*)\s*{\s*/g
const rightBrace: RegExp = /.*}.*/g
const bodyReg: RegExp = /^\s*(\w+)\s*\(([\[\]\w]+),?\s*(\w+)?\):?(.+)?/g
const arrReg: RegExp = /array\[(\w+)]$/g

const RESULT = 'Result'

export class Resolver {
    private source : Iresult = {}
    constructor(source: Iresult) {
        this.source = source
    }

    getType (type: string): {type: string, builtin: boolean} {
        let result: {type:string, builtin: boolean} = {type: type, builtin: false}
        switch (type) {
            case 'string':
                result.type = type
                result.builtin = true
                break
            case 'integer':
                result.type = 'number'
                result.builtin = true
                break
            default:
                result.type = type
                result.builtin = false
                break
        }

        return result
    }
}

export interface Iline {
    name?: string
    type?: string
    optional?: boolean
    comment?: string
}

export interface Iresult {
    [name: string]: Iline[]
}

export class Receiver {
    offset: number = 0
    header: string = ''
    result: Iresult = {}

    receive (line: string): never | Receiver {
        // console.log(leftBrace.test('Result«WorkOrderView» {'))
        // console.log(rightBrace.test('}'))
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
        let lineResult: Iline = {}
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

    getResult(): Iresult  {
        return this.result
    }

    getParsedResult () {
        return new Resolver(this.result)
    }

    static instance (): Receiver {
        return new Receiver()
    }
}

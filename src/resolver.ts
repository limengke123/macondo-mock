const leftBrace: RegExp = /\s*(.*)\s*{\s*/g
const rightBrace: RegExp = /.*}.*/g
const bodyReg: RegExp = /^\s*(\w+)\s*\(([\[\]\w]+),?\s*(\w+)?\):?(.+)?/g
const arrReg: RegExp = /array\[(\w+)]$/g
export class Resolver {
    private line: string = ''
    private header: string = ''

    constructor(line: string) {
        this.line = line
    }

    isLeftBrace (str: string): boolean {
        return leftBrace.test(str)
    }
    getHeader (): string {
        this.line.replace(leftBrace, (_, name: string) => {
            this.header = name
            return this.line
        })
        return this.header
    }
    isRightBrace (str: string): boolean {
        return rightBrace.test(str)
    }

    parse () {
        if (this.isLeftBrace(this.line)) {
            this.getHeader()
        }
    }

}

export interface Iline {
    name?: string
    type?: string
    optional?: string
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
            line.replace(leftBrace, (_, name) => {
                this.header = name.trim()
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
                optional,
                comment
            }
            return line
        })
        return lineResult
    }

    getResult(): Iresult  {
        return this.result
    }

    static instance (): Receiver {
        return new Receiver()
    }
}

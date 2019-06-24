const leftBrace: RegExp = /^\s*(\w*)\s*{.*/g
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
    private offset: number = 0
    private header: string = ''
    private result: Iresult = {}

    receive (line: string): never | Receiver {
        if (leftBrace.test(line)) {
            // 遇到了 {
            if (this.offset !== 0) {
                throw new Error('swagger文档格式有问题，连续出现两个 { { ，检查是否格式有问题')
            }
            this.offset = -1
            line.replace(leftBrace, (_, name) => {
                this.header = name
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
            line.replace(bodyReg, (_, name, type, optional, comment) => {
                const lineResult: Iline = {
                    name,
                    type,
                    optional,
                    comment
                }
                this.result[this.header].push(lineResult)
                return line
            })
            return this
        }
        return this
    }

    getResult(): Iresult  {
        return this.result
    }

    static instance (): Receiver {
        return new Receiver()
    }
}

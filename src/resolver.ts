export class Resolver {
    private leftBrace: RegExp = /^\s+(\w+)\s+{.+/g
    private rightBrace: RegExp = /.+}.+/g

    isLeftBrace (str: string): boolean {
        return this.leftBrace.test(str)
    }
    isRightBrace (str: string): boolean {
        return this.rightBrace.test(str)
    }


}

import chalk from 'chalk'
import has = Reflect.has;

const SPACE = '  '

export const success = (text: string, withTag: boolean = false): void => {
    if (withTag) {
        console.log(SPACE, chalk.bgGreen.rgb(255, 255, 255)('SUCCESS'))
    }
    console.log(SPACE, chalk.green(text))
}

export const error = (text: string = '', withTag: boolean = true): void => {
    if (withTag) {
        console.log(SPACE, chalk.bgRed.rgb(255, 255, 255)('ERROR'))
    }
    console.log(SPACE, chalk.red(text))
}

export const warning = (text: string, withTag: boolean = false) => {
    if (withTag) {
        console.log(SPACE, chalk.bgYellow.rgb(255, 255, 255)('WARNING'), '\n')
    }
    console.log(SPACE, chalk.yellow(text))
}

export function diff<T> (arr1: T[], arr2: T[], equal: (a:T, b:T) => boolean): T[] {
    // diff两个数组, 从arr1中找到arr2中没有的
    return arr1.reduce<T[]>((accu, current) => {
        let l = arr2.length
        let hasSame = false
        while (l--) {
            if (equal(current, arr2[l])) {
                hasSame = true
            }
        }
        if (!hasSame) {
            accu.push(current)
        }
        return accu
    }, [])
}

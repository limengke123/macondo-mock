import chalk from 'chalk'

const SPACE = '  '

export const success = (text: string, withTag: boolean = false): void => {
    if (withTag) {
        console.log(SPACE, chalk.bgGreenBright.white('SUCCESS'), '\n')
    }
    console.log(SPACE, chalk.green(text))
}

export const error = (text: string = '', withTag: boolean = true): void => {
    if (withTag) {
        console.log(SPACE, chalk.bgRedBright.white('ERROR'), '\n')
        console.log('\n')
    }
    console.log(SPACE, chalk.red(text))
}

export const warning = (text: string, withTag: boolean = false) => {
    if (withTag) {
        console.log(SPACE, chalk.bgYellowBright.white('WARNING'), '\n')
    }
    console.log(SPACE, chalk.yellow(text))
}

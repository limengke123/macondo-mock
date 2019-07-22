import * as cosmiconfig from 'cosmiconfig'
import {name} from '../../package.json'
import {success} from '../util/commonUtil'
import merge =  require('lodash.merge')
import {getOption, IConfigOption, option, setOption} from '../core/option'

const ERROR_PATH = '1. 加载 config： '

export function loadConfig (option: option = {}): Promise<undefined> {
    const explorer = cosmiconfig(name)
    return explorer.search()
        .then(result => {
            let mergeOption: option = {}
            if (result) {
                mergeOption = merge<typeof option, typeof result.config>(option, result.config)
            } else {
                mergeOption = option
            }
            setOption(merge<typeof mergeOption, IConfigOption>(mergeOption, getOption()))
            const configOption = getOption()
            if (!configOption.baseOption.mockPath) {
                throw new Error(ERROR_PATH + '不存在 mockPath 字段')
            }
            success(`${ERROR_PATH} 成功解析配置文件`)
            return undefined
        })
}

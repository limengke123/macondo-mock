import * as cosmiconfig from 'cosmiconfig'
import { option, optionTuple } from '../index'
import {name} from '../../package.json'

export function loadConfig (option: option): Promise<optionTuple> {
    const explorer = cosmiconfig(name)
    return explorer.search()
        .then(result => {
            if (result) {
                return [{
                    ...result.config,
                    ...option
                }, undefined]
            } else {
                return [option, undefined]
            }
        })
}

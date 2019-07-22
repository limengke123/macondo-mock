export interface option {
    baseOption?: baseOption
    schemaOption?: schemaOption
    dbOption?: dbOption
    serverOption?: serverOption
}
export interface baseOption {
    mockPath?: string
}
export interface Isurmise {
    test: string
    mock?: string | {regexp: string}
    data?: string
    length?: number
}
export interface schemaOption {
    // 是否强制生成 schema 文件
    force?: boolean
    // 推断类型
    surmise?: Array<Isurmise> | Isurmise
    global?: {
        number?: string
        array?: string
        string?: string
        boolean?: string,
        object: Dictionary<any>
    },
    recursiveDepth?: number
}
export interface dbOption {
    force?: boolean
}
export interface serverOption {
    port?: number,
    interfaceName?: string
}

export interface IConfigOption extends Required<option> {
    baseOption: Required<baseOption>
    schemaOption: Required<schemaOption>
    dbOption: Required<dbOption>
    serverOption: Required<serverOption>
}

let configOption: IConfigOption = {
    baseOption: {
        mockPath: './mock'
    },
    schemaOption: {
        force: false,
        global: {
            number: '@integer(1, 10000)',
            string: '@csentence',
            boolean: '@boolean',
            array: '@integer(0, 10)',
            object: {},
        },
        recursiveDepth: 3,
        surmise: []
    },
    dbOption: {
        force: true
    },
    serverOption: {
        port: 3000,
        interfaceName: ''
    }
}

export function setOption (option: IConfigOption) {
    configOption = option
}

export function getOption(): IConfigOption {
    return configOption
}

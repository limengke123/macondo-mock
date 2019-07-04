#! usr/bin/env node

const program = require('commander')
const { mock, generateSchema, generateData, startServer, loadConfig } = require('../lib/index')
const { version } = require('../package.json')

program
    .version(version)
    .option('-s, --schema', '强制生成生成 schema.json 文件')
    .option('-d --data', '重新生成 data.json 文件')
    .option('-o --open', '启动本地 mock 服务')
    .parse(process.argv)

if (program.open) {
    Promise.resolve()
        .then(loadConfig)
        .then(startServer)
} else if (program.schema || program.data) {
    Promise.resolve()
        .then(loadConfig)
        .then(option => {
            if (program.schema) {
                // 强制生成 schema 文件
                return generateSchema(option, true)
            }
            return option
        })
        .then(option => {
            if (program.data) {
                return generateData(option)
            }
        })
        .then(() => {
            console.log('脚本执行完毕')
        })
} else {
    mock()
}


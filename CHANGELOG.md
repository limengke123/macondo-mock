# [2.0.0](https://github.com/limengke123/macondo-mock/compare/v1.1.1...v2.0.0) (2019-07-13)


### Bug Fixes

* 修复低版本node不能创建多层级文件夹的问题 ([c2c6954](https://github.com/limengke123/macondo-mock/commit/c2c6954))


### Features

* loadDir功能 ([4061177](https://github.com/limengke123/macondo-mock/commit/4061177))
* 优化服务启动显示 ([a8fab3d](https://github.com/limengke123/macondo-mock/commit/a8fab3d))
* 修改跳过步骤文案 ([61285d7](https://github.com/limengke123/macondo-mock/commit/61285d7))
* 减少db.json文件的重复生成 ([03746e1](https://github.com/limengke123/macondo-mock/commit/03746e1))
* 加入rimraf 方便构建的时候移除旧的lib目录 ([e5e5d15](https://github.com/limengke123/macondo-mock/commit/e5e5d15))
* 抽离generateData生成文件，便于批量生成 ([18ba79d](https://github.com/limengke123/macondo-mock/commit/18ba79d))
* 抽离生成schema文件函数，为批量生成schema.json做准备 ([ca2e8b6](https://github.com/limengke123/macondo-mock/commit/ca2e8b6))
* 新增mock文件夹的生成 ([6f36410](https://github.com/limengke123/macondo-mock/commit/6f36410))
* 调整整体解析路口，改为mock文件夹路口去处理 ([43d89bd](https://github.com/limengke123/macondo-mock/commit/43d89bd))
* 调整文件生成逻辑，支持批量生成接口 ([441355e](https://github.com/limengke123/macondo-mock/commit/441355e))
* 隔离传参，分组传 ([4fa3b7d](https://github.com/limengke123/macondo-mock/commit/4fa3b7d))



## [1.1.1](https://github.com/limengke123/macondo-mock/compare/v1.1.0...v1.1.1) (2019-07-04)


### Bug Fixes

* 修复hooks上的脚本错误 ([382cbb2](https://github.com/limengke123/macondo-mock/commit/382cbb2))


### Features

* 修复脚本调用方式，支持独立生成schema文件和独立启动本地mock服务 ([1d219be](https://github.com/limengke123/macondo-mock/commit/1d219be))
* 减少db.json文件的重复生成(待办) ([1074ffb](https://github.com/limengke123/macondo-mock/commit/1074ffb))
* 分离内部代码结构，抽离parser ([04145cf](https://github.com/limengke123/macondo-mock/commit/04145cf))
* 增加package字段 ([00abd8b](https://github.com/limengke123/macondo-mock/commit/00abd8b))
* 引入 commander ，优化脚本使用方式。 ([0e154f0](https://github.com/limengke123/macondo-mock/commit/0e154f0))
* 暴露 generateSchema、 generateData、 startServer 出去，方便三方直接调用内部方法。 ([f176381](https://github.com/limengke123/macondo-mock/commit/f176381))
* 调整打印颜色 ([c61ac23](https://github.com/limengke123/macondo-mock/commit/c61ac23))



# [1.1.0](https://github.com/limengke123/macondo-mock/compare/2aaf70a...v1.1.0) (2019-07-02)


### Features

* example ([7d3365b](https://github.com/limengke123/macondo-mock/commit/7d3365b))
* example file ([637b097](https://github.com/limengke123/macondo-mock/commit/637b097))
* init project ([2aaf70a](https://github.com/limengke123/macondo-mock/commit/2aaf70a))
* 优化运行过程的提示 ([0a6089d](https://github.com/limengke123/macondo-mock/commit/0a6089d))
* 初始化项目 ([c13cd15](https://github.com/limengke123/macondo-mock/commit/c13cd15))
* 加入 json-server 生成本地express服务 ([320452b](https://github.com/limengke123/macondo-mock/commit/320452b))
* 加入 mockjs 生成随机文字和数字 ([01d66e9](https://github.com/limengke123/macondo-mock/commit/01d66e9))
* 加入 schema.json文件的判存 ([c9c33af](https://github.com/limengke123/macondo-mock/commit/c9c33af))
* 加入多种推断正则，去推测可能的mock类型 ([bf32a5a](https://github.com/limengke123/macondo-mock/commit/bf32a5a))
* 增加 changelog ([5c5c70f](https://github.com/limengke123/macondo-mock/commit/5c5c70f))
* **resolver:** 修改tsconfig, 不生成测试文件 ([369fd97](https://github.com/limengke123/macondo-mock/commit/369fd97))
* 增加生成data.json功能 ([75c5613](https://github.com/limengke123/macondo-mock/commit/75c5613))
* **resolver:** 按行解析swagger文档 ([1253cd5](https://github.com/limengke123/macondo-mock/commit/1253cd5))
* 增加解析array ([8090cd6](https://github.com/limengke123/macondo-mock/commit/8090cd6))
* 整理入口代码，完善代码处理逻辑，加入cosmiconfig来处理全局的配置 ([d333cd2](https://github.com/limengke123/macondo-mock/commit/d333cd2))
* **resolver:** 解析swagger文档 ([6d892aa](https://github.com/limengke123/macondo-mock/commit/6d892aa))
* 整理整体的入口文件，promise 整理处理方式 ([06c20e2](https://github.com/limengke123/macondo-mock/commit/06c20e2))
* 整理目录结构，加入 chalk 模块 ([444affd](https://github.com/limengke123/macondo-mock/commit/444affd))
* 生成schema.json文件 ([ac3ebc6](https://github.com/limengke123/macondo-mock/commit/ac3ebc6))
* 自动判断 id 类型、time类型 生成对应数字 ([a627216](https://github.com/limengke123/macondo-mock/commit/a627216))
* 解析schema.json 生成直接使用的data对象 ([3124795](https://github.com/limengke123/macondo-mock/commit/3124795))
* 解析文件 ([e015673](https://github.com/limengke123/macondo-mock/commit/e015673))
* 跳过重复创建 schema.json 文件 ([6e71370](https://github.com/limengke123/macondo-mock/commit/6e71370))




# macondo-mock

> macondo 是**百年孤独**中的一个地名，译作**马孔多**。

本地的一种接口 `mock` 方案，在得到接口的 `swagger` 文档之后生成本地 mock 接口服务，方便本地调试使用。

## 使用场景

1. 服务端接口定义好了，但是没有具体实现好或是不能调用的时候，用本地 `mock` 代替。
2. 查询类数据，服务端接口数据可能不够充足，不方便页面调试，本地 `mock` 就能很好解决。
3. 在离线环境、网络不稳定的情况下方便调试。

## 使用
pass

## 配置化

`macondo-mock` 是高度可配置化，如同`babel`、`typescript`、`jest` 的配置文件一样，可以在 `package.json` 中加入 `"macondo-mock"` 字段，或者是新建 `macondo-mockrc.yaml`、`macondo-mockrc.yml`、`macondo-mockrc.json`、`macondo-mockrc.js`、`macondo-mock.config.js` 写入配置项。

### 配置项

#### swagger解析配置

| fileds | 类型 | 默认值 | 解释 |
| --- | --- | --- | --- |
| swaggerPath | string | - | swagger文档的路径 |
| schemaPath | string | - | schema.json文件生成的路径 |


## 获取 mock 类型

假数据由 [mockjs](http://mockjs.com/examples.html) 生成，需要更改预设值，直接修改 `schema.json` 文件的 `mock` 字段。

### 默认 mock 类型

| 类型 | 默认值 `mock` 值 | 解释 | 示例 |
| --- | --- | --- | --- |
| `string` | `@csentence` | 一般字符串 | "白高长正深常究厂影常小际么知影证。" |
| `number` | `@integer(1, 10000)` | 一般数字 | 729 |
| `boolean` | `@boolean` | 布尔值 | `true` |
| `array.length` | `@integer(0, 50)` | 数组的长度 | 38 |
| `/\w*(?:[dD]ate)|(?:[tT]ime)\w*/` | @datetime | 符合正则的时间类型 | "2014-02-18 20:33:40" |
| `/\w*[iI]d$/` | `@increment` | 符合正则的 `id`，保证 `id` 不重复 | "2014-02-18 20:33:40" |
| `/\w*[Nn]ame$/` | `@cname` | name |
| `/^province(?:Name)?$/` | `@province` | 省份 |
| `/^city(?:Name)?$/` | `@city` | 城市 |
| `/\w*[pP]ics?|\w*[pP]ictures?|\w*[iI]mgs?|\w*[iI]mages?/` | `@image` | 图片 |
| `/\w*[cC]ode$/` | `@string("lower", 5)` | code |
| `/\w*[pP]hone(?:Number)?/` | `{"regexp": "\\d{11}"}` | 手机号 |

### 常用 mock 类型

默认的 `mock` 类型不可能在所有场景都能很好使用，这里列举常用的 `mock` 类型：

| mock | 解释 | 返回示例 |
| --- | --- | --- |
| `@pick(["a", "e", "i", "o", "u"])` | 在一个枚举值中随机挑选一个值，常用语**状态**之类的字段 | `e` |
| `@region` | 返回一个区域 | 华北 |
| `@province` | 返回一个省份 | 河北省 |
| `@city` | 返回一个城市 | 菏泽市 |
| `@city(true)` | 返回一个带省份的城市 | 浙江省 宁波市 |
| `@county` | 返回一个区、县 | 长宁区 |
| `@city(true)` | 返回完整的区县 | 北京 北京市 海淀区 |
| `@email` | 返回随机邮箱 | t.npqzluvzg@yoz.tk |
| `@url` | 返回随机 `url` 地址 | "http://nscgpruo.su/plfjwr" |
| `@cname` | 返回随机中文姓名 | 康艳 |
| `@cword( pool?, min?, max? )` | 返回限定的随机长度的随机中文字符 | 在院门 |
| `@cparagraph( min?, max? )` | 返回限定的随机长度的中文段落 | 构标号住石见关包往再声亲严证千度真。五增上已每法流确京北改开总农圆。如群省志然料且史好比物质达低长天门。第里中型研装果其内等土调号了存机见七。查已问回江员求子育属世式土党速。|
| `@image( size?, background?, foreground?, format?, text? )` | 返回一个图片地址 | "http://dummyimage.com/200x100/FF6600" |
| `@id` | 生成一个身份证号 | 360000201905197112 |

### 覆盖默认 mock 数据

对于基本类型的数据，给 `data` 字段赋值就能覆盖mock数据，数组长度只需覆盖 `length`字段就能固定长度。


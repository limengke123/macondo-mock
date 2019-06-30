# macondo-mock

本地的一种接口 `mock` 方案，在得到接口的 `swagger` 文档之后生成本地 mock 接口服务，方便本地调试使用。

## 使用场景

1. 服务端接口定义好了，但是没有具体实现好或是不能调用的时候，用本地 `mock` 代替。
2. 查询类数据，服务端接口数据可能不够充足，不方便页面调试，本地 `mock` 就能很好解决。

## 获取 mock 类型

假数据由 [mockjs](http://mockjs.com/examples.html) 生成，需要更改预设值，直接修改 `schema.json` 文件的 `mock` 字段。

### 默认 mock 类型

| 类型 | 默认值 `mock` 值 | 解释 | 实例 |
| --- | --- | --- | --- |
| string | @csentence | 一般字符串 | "白高长正深常究厂影常小际么知影证。" |
| number | @integer(1, 10000) | 一般数字 | 729 |
| boolean | @boolean | 布尔值 | true |
| array.length | @integer(0, 50) | 数组的长度 | 38 |
| // | @datetime | 符合正则的时间类型 | "2014-02-18 20:33:40" |

### 覆盖默认 mock 数据

对于基本类型的数据，给 `data` 字段赋值就能覆盖mock数据，数组长度只需覆盖 `length`字段就能固定长度。

## 使用

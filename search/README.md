# 股票搜索和涨跌幅查询功能

这是一个完整的股票搜索和涨跌幅查询系统，支持通过关键词搜索股票，并查看详细的涨跌幅信息。

## 功能特点

- ✅ **股票搜索**：通过关键词搜索股票、基金、指数等
- ✅ **用户选择**：搜索完成后可以选择查看某一项的涨跌幅
- ✅ **涨跌幅显示**：显示详细的价格信息，包括现价、涨跌幅、成交量等
- ✅ **交互式操作**：支持命令行交互选择
- ✅ **批量操作**：支持直接指定选择项

## 使用方法

### 1. 交互式搜索和选择

```bash
node index.js "搜索关键词"
```

示例：
```bash
node index.js "苹果"
node index.js "AAPL"
node index.js "上证50"
```

运行后会显示搜索结果，然后提示您选择要查看涨跌幅的项目。

### 2. 直接指定选择项

```bash
node index.js "搜索关键词" 选择编号
```

示例：
```bash
node index.js "AAPL" 1    # 直接选择第一项
node index.js "MSFT" 2    # 直接选择第二项
```

### 3. 作为模块使用

```javascript
const { performFullSearch, searchStocks, getStockPrice } = require('./index.js');

// 完整搜索流程
await performFullSearch('AAPL', 1);

// 只搜索
const results = await searchStocks('苹果');

// 只获取价格
const priceData = await getStockPrice('AAPL', 105);
```

## 显示的信息

### 搜索结果包含：
- 股票名称
- 股票代码
- 类型（US、指数、沪基等）
- 拼音简称
- 市场信息
- 状态

### 涨跌幅信息包含：
- 当前价格
- 涨跌额
- 涨跌幅
- 开盘价
- 最高价
- 最低价
- 昨收价
- 成交量
- 成交额
- 振幅
- 总市值
- 流通市值
- 更新时间

## API说明

### 搜索API
- **接口**：`https://search-codetable.eastmoney.com/codetable/search`
- **参数**：keyword（关键词）、pageIndex（页码）、pageSize（每页大小）

### 价格API
- **接口**：`https://push2.eastmoney.com/api/qt/stock/get`
- **参数**：secid（股票代码）、fields（字段列表）

## 注意事项

1. **编码问题**：在Windows PowerShell中，中文关键词可能显示乱码，建议使用英文或数字代码
2. **网络延迟**：API调用可能需要一些时间，请耐心等待
3. **数据准确性**：当前版本使用模拟数据演示功能，实际应用中需要连接真实API
4. **错误处理**：程序包含完整的错误处理机制，会显示详细的错误信息

## 扩展功能

可以基于此框架扩展更多功能：
- 实时价格监控
- 历史价格查询
- 技术指标计算
- 投资组合管理
- 价格预警系统

## 技术栈

- **Node.js**：运行环境
- **Fetch API**：HTTP请求
- **Readline**：用户交互
- **URLSearchParams**：URL参数构建

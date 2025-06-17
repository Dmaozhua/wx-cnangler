# Neo Brutalist 组件库使用说明

## 概述

Neo Brutalist 组件库提供了两种使用方式：

1. **完整组件库** - 包含所有组件的完整展示
2. **拆分组件** - 可以单独引用和使用的独立组件

## 拆分组件列表

### 1. Neo Button (neo-button)

**功能**: Neo Brutalist 风格的按钮组件

**属性**:
- `text`: 按钮文本 (默认: 'Neo Button')
- `color`: 背景颜色 (默认: 'yellow')
- `textColor`: 文字颜色 (默认: 'black')
- `disabled`: 是否禁用 (默认: false)
- `size`: 按钮大小 'normal'|'large'|'small' (默认: 'normal')

**事件**:
- `bind:tap`: 按钮点击事件

**使用示例**:
```xml
<neo-button text="点击我" color="#FF6B6B" bind:tap="onButtonClick"></neo-button>
```

### 2. Neo Card (neo-card)

**功能**: Neo Brutalist 风格的卡片组件

**属性**:
- `title`: 卡片标题 (默认: 'Neo Card')
- `content`: 卡片内容 (默认: 描述文本)
- `bgColor`: 背景颜色 (默认: '#06FFA5')
- `showTitle`: 是否显示标题 (默认: true)
- `height`: 卡片高度 (默认: 'auto')

**事件**:
- `bind:cardtap`: 卡片点击事件

**使用示例**:
```xml
<neo-card title="我的卡片" 
          content="这是卡片内容" 
          bg-color="#FFD93D"
          bind:cardtap="onCardClick">
</neo-card>
```

### 3. Neo Input (neo-input)

**功能**: Neo Brutalist 风格的输入框组件

**属性**:
- `placeholder`: 占位符文本 (默认: 'Enter text...')
- `value`: 输入框值 (默认: '')
- `type`: 输入类型 'text'|'number'|'password' (默认: 'text')
- `disabled`: 是否禁用 (默认: false)
- `maxlength`: 最大长度 (默认: 140)
- `bgColor`: 背景颜色 (默认: '#FFFFFF')
- `label`: 标签文本 (默认: '')

**事件**:
- `bind:input`: 输入变化事件
- `bind:focus`: 获得焦点事件
- `bind:blur`: 失去焦点事件
- `bind:confirm`: 确认输入事件

**使用示例**:
```xml
<neo-input label="用户名" 
           placeholder="请输入用户名"
           bind:input="onInputChange">
</neo-input>
```

## 如何引用拆分组件

### 1. 在页面配置文件中引用

在你的页面 `.json` 文件中添加组件引用：

```json
{
  "usingComponents": {
    "neo-button": "/components/neo-button/neo-button",
    "neo-card": "/components/neo-card/neo-card",
    "neo-input": "/components/neo-input/neo-input"
  }
}
```

### 2. 在模板中使用

在你的页面 `.wxml` 文件中使用组件：

```xml
<view class="container">
  <!-- 使用按钮组件 -->
  <neo-button text="提交" color="#4ECDC4" bind:tap="onSubmit"></neo-button>
  
  <!-- 使用卡片组件 -->
  <neo-card title="用户信息" 
            content="显示用户的基本信息"
            bind:cardtap="onUserCardTap">
  </neo-card>
  
  <!-- 使用输入框组件 -->
  <neo-input label="邮箱" 
             type="text"
             placeholder="请输入邮箱地址"
             bind:input="onEmailInput">
  </neo-input>
</view>
```

### 3. 在页面逻辑中处理事件

在你的页面 `.js` 文件中添加事件处理：

```javascript
Page({
  data: {
    // 页面数据
  },

  // 按钮点击处理
  onSubmit: function(e) {
    const { text } = e.detail;
    console.log('按钮被点击:', text);
  },

  // 卡片点击处理
  onUserCardTap: function(e) {
    const { title, content } = e.detail;
    wx.showModal({
      title: title,
      content: content
    });
  },

  // 输入框变化处理
  onEmailInput: function(e) {
    const { value } = e.detail;
    this.setData({
      email: value
    });
  }
});
```

## 优势

### 拆分组件的优势：
- **按需引用**: 只引用需要的组件，减少代码体积
- **独立维护**: 每个组件独立，便于维护和更新
- **灵活定制**: 可以单独修改某个组件的样式和功能
- **复用性强**: 可以在多个页面中复用同一个组件

### 完整组件库的优势：
- **快速预览**: 可以一次性查看所有组件效果
- **统一管理**: 所有组件在一个文件中管理
- **展示方便**: 适合作为组件展示页面

## 自定义样式

如果需要自定义组件样式，可以：

1. **修改组件属性**: 通过传入不同的 `color`、`bgColor` 等属性
2. **覆盖样式**: 在页面的 `.wxss` 文件中覆盖组件样式
3. **修改组件源码**: 直接修改组件的 `.wxss` 文件

## 扩展组件

如果需要更多组件，可以参考现有组件的结构创建新组件：

1. 创建组件目录 `/components/neo-xxx/`
2. 创建四个文件：`.js`、`.wxml`、`.wxss`、`.json`
3. 按照 Neo Brutalist 风格设计样式
4. 在需要的页面中引用

## 技术支持

如有问题，请检查：
- 组件路径是否正确
- 属性名称是否正确
- 事件绑定是否正确
- 微信开发者工具控制台是否有错误信息
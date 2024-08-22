# structure

### 标签渲染

```vue
<div id="app">{{message}}</div>

<script>
new Vue({
  el: "#app",

  data: {
    message: "hello",
  },
});
</script>
```

- 模板检测，获取模板把模板转换为 render
- 创建 updateComponent 渲染函数的回调函数
- updateComponent 回调处理创建虚拟 DOM，以及虚拟 DOM 到真实 DOM 的映射以及创建
- 注册渲染 Watcher，数据观测，发生变化时触发 updateComponent 回调

### 组件的渲染

组件是对普通标签的封装，组件创建过程中会对组件对象进行扩展，属性，生命周期处理。
通过继承的方式，组件拥有和 Vue 相同的能力。

### 编译器

源代码转换为目标代码。模板转换为 render 函数。
编译前端：词法分析 -> 语法分析 -> 语义分析 -> 模板 AST
编译后端：中间代码生成 -> 优化 -> 目标代码生成 -> 目标代码

```html
<div id="app" @click="handleClick">hello</div>
```

```js
const ast = {
  type: 'Element',
  tag: "div",
  attrs: [
    {
      name: 'id',
      value: 'app'
    }
  ],
  events: {
    click: {
      value: 'handleClick'
    }
  }
  children: [
    {
      type: 'text',
      text: 'hello'
    },
  ],
};
```

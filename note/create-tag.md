# 普通标签的渲染流程

- 编译阶段：编译模板，识别模板语法，事件绑定，属性绑定，数据绑定等，生成AST，生成渲染函数

- 响应式注册：注册渲染函数回调，初次渲染和更新渲染

- 渲染阶段：渲染函数生成虚拟DOM树，通过虚拟DOM树创建真实DOM，更新阶段通过Diff算法更新变动的内容


```html
<div id="app">{{ message }}</div>

<script>
  new Vue({
    el: '#app'，
    data() {
      return {
        message: 'hello'
      }
    }
  })
</script>
```

## 编译模板生成渲染函数

```js
// platforms/web/entry-runtime-with-compiler.js

const { render, staticRenderFns } = compileToFunctions(
  template,
  {
    outputSourceRange: process.env.NODE_ENV !== "production",
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments,
  },
  this
);
```

## 响应式注册，注册渲染函数回调

```js
// core/instance/lifecycle.js

updateComponent = () => {
  vm._update(vm._render(), hydrating);
};

new Watcher(
  vm,
  updateComponent,
  noop,
  {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, "beforeUpdate");
      }
    },
  },
  true /* isRenderWatcher */
);
```

## 渲染虚拟DOM

### $createElement 生成虚拟 DOM 树

```js
// core/instace/render.js

vnode = render.call(vm._renderProxy, vm.$createElement);
```

### patch 通过虚拟 DOM 创建真实 DOM

```js
// core/instance/patch.js

createElm(
  vnode,
  insertedVnodeQueue,
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
);
```

# 组件的渲染流程

```js
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

- 编译阶段：入参提供了render函数，不需要编译

- 实例化组件：
  - 初始化阶段:
    - 创建子组件构造函数：组件本质上是一个对象，但是这个对象不仅仅是渲染内容就可以了，还需要管理自身状态，生命周期等等，因此通过继承 Vue 创建子组件的构造函数。
    - 注册组件生命周期：在init生命周期中会触发组件的实例化。
    - 创建组件虚拟 DOM：这个虚拟DOM是一个占位节点没有子节点。对子组件的一个引用。
  - 实例化阶段
    - patch/createEl：通过虚拟节点创建真实DOM，进入组件的创建过程。
    - 实例化组件
      组件的实例化是在组件的生命周期`init`中触发的，`init`方法调用`createComponentInstanceForVnode`，
      组件实例化会执行`core/instance/init.js`中的`_init`方法，`_init`方法会对实例化组件的拓展，
      执行结束返回到生命周期`init`方法中，挂载子组件`child.$mount(hydrating ? vnode.elm : undefined, hydrating);`,
      进入`mountComponent`方法。

- 响应式注册：注册渲染回调

- 渲染阶段：生成渲染DOM树，创建真实DOM。

## 实例化组件

### 初始化阶段

#### 创建子组件构造函数

```js
// core/vdom/create-component.js

if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor);
}
```

#### 继承

```js
// core/global-api/extend.js

const Sub = function VueComponent(options) {
  this._init(options);
};
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
```

#### 注册生命周期

```js
// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  init(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ));
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions;
    const child = (vnode.componentInstance = oldVnode.componentInstance);
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, "mounted");
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy(vnode: MountedComponentVNode) {
    const { componentInstance } = vnode;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  },
};
```

#### 创建组件虚拟 DOM

```js
// core/vdom/create-component.js

const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ""}`,
  data,
  undefined,
  undefined,
  undefined,
  context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
);
```

### 实例化阶段

#### patch/createEl

```js
// core/vdom/patch.js

// function createElm
if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
  return;
}

function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data;
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      // 调用组件生命周期的init方法 实例化子组件
      i(vnode, false /* hydrating */);
    }
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}
```

#### 实例化的执行

```js
export function createComponentInstanceForVnode(
  vnode: any,
  parent: any
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  };
  const inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options);
}
```

#### 实例化的过程

```js
// core/instance/init.js

// function createEl
if (options && options._isComponent) {
  initInternalComponent(vm, options);
} 
```

```js
// core/instance/init.js

export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```


## 响应式注册

```js
// core/instance/lifecycle.js

updateComponent = () => {
  vm._update(vm._render(), hydrating);
};

// 创建响应式渲染器，处理DOM的创建和更新
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

## 渲染阶段

### 生成虚拟DOM树

```js
// core/instace/render.js

vnode = render.call(vm._renderProxy, vm.$createElement);
```

### 创建DOM

```js
// core/instance/patch.js

createElm(
  vnode,
  insertedVnodeQueue,
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
);
```

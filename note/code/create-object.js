/**
 * 创建一个对象
 */

// 我的写法
// --------------------------------------
function Vue() {}

Vue.prototype.init = function () {
  console.log("init");
};

Vue.prototype.mount = function () {
  console.log("mount");
};

Vue.prototype.render = function () {
  console.log("render");
};

const vue = new Vue();
console.log(vue);
// --------------------------------------

// 大佬的写法
// ---------------------------------------
function Vue2() {
  this.init();
}

initMixin(Vue2);
mountMixin(Vue2);
renderMixin(Vue2);

function initMixin(vm) {
  vm.prototype.init = function () {
    console.log("init");
  };
}

function mountMixin(vm) {
  vm.prototype.mount = function () {
    console.log("mount");
  };
}

function renderMixin(vm) {
  vm.prototype.render = function () {
    console.log("render");
  };
}

const vue2 = new Vue2();
console.log(vue2);
// ---------------------------------------

// 大佬的写法 无new创建
// ---------------------------------------
function jQuery() {
  return new jQuery.fn.init();
}

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,

  text() {},
};

var init = (jQuery.fn.init = function () {
  console.log("init");
  this.show = function () {};
});

init.prototype = jQuery.fn;

const instance = jQuery();
console.log(instance);
// ---------------------------------------

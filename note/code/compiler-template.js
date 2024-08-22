function R(options) {
  this.init(options);
}

R.prototype.init = function (options) {
  this.options = options;
  this.parse();
};

R.prototype.parse = function () {
  const options = this.options;
  function template() {
    return document.querySelector(options.el).outerHTML;
  }
  console.log(template());
};

R.prototype.render = function () {};

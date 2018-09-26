// #PACKAGE: components
// #MODULE: grid
/**
 * AbstractSearchForm is a superclass of BasicSearch and AdvancedSearch.
 * @class AbstractSearchForm
 * @extends UI.Component
 * @param config
 * @constructor
 */
var AbstractSearchForm = function (config) {
  var __config = config || {};
  CT.apply(this, __config);
  if (isEmpty(this.id))
    throw new Error("Search ID component must not be null");

  if (isEmpty(this.url))
    throw new Error("Search URL must not be null");

  AbstractSearchForm.superclass.constructor.call(this);
};
CT.extend(AbstractSearchForm, Component, {
  intComponent: function () {
  },
  getUrl: function () {
    return this.url;
  },
  getId: function () {
    return this.id;
  },
  getEl: function () {
    return $('#' + this.getId());
  },
  getData: function () {

  }
});
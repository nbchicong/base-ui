// #PACKAGE: grid
// #MODULE: AbstractSearchForm
$(function () {
  /**
   * AbstractSearchForm is a superclass of BasicSearch and AdvancedSearch.
   * @class UI.grid.AbstractSearchForm
   * @extends UI.Component
   * @param config
   * @constructor
   */
  UI.grid.AbstractSearchForm = function (config) {
    var __config = config || {};
    BaseUI.apply(this, __config);
    if(BaseUI.isEmpty(this.id)) {
      throw new Error("Search ID component must not be null");
    }
    if(BaseUI.isEmpty(this.url)) {
      throw new Error("Search URL must not be null");
    }
    UI.grid.AbstractSearchForm.superclass.constructor.call(this);
  };
  BaseUI.extend(UI.grid.AbstractSearchForm, UI.Component, {
    intComponent : function() {
    },
    getUrl : function() {
      return this.url;
    },
    getId : function() {
      return this.id;
    },
    getEl: function(){
      return $.getCmp(this.getId());
    },
    getData : function() {

    }
  });
});
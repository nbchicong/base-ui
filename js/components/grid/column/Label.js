// #PACKAGE: grid-columns
// #MODULE: Label
$(function () {
  BaseUI.ns("UI.grid.column.Label");
  /**
   * @class UI.grid.column.Label
   * @extends UI.grid.Editor
   * @param config
   * @constructor
     */
  UI.grid.column.Label = function (config) {
    config = config || {};
    BaseUI.apply(this, config);//apply configuration
    UI.grid.column.Label.superclass.constructor.call(this) ;
  };
  BaseUI.extend(UI.grid.column.Label, UI.grid.Editor, {
    render: function(v){
      this.setEl($(String.format('<span>{0}</span>',!BaseUI.isEmpty(v) ? v : '')));
      return this.getEl();
    },
    edit: function(v){
      return this.render(v);
    },
    getValue: function(){
      return (this.getEl().length>0) ? this.getEl().html() : null;
    },
    setValue: function(v){
      this.getEl().html(!BaseUI.isEmpty(v)? v: '');
    },
    focus: function(){
      this.getRow().find('input:first').focus();
    }
  });
  UI.grid.ColumnManager.registerType('label', UI.grid.column.Label);

});